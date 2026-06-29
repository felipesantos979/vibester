import { randomUUID } from "crypto";

import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../repository/post.repository";
import { Comment, CreateCommentInput, UpdateCommentInput } from "../types/comment.type";
import { producer } from "../kafka/producer";
import { HttpError } from "../errors/http.error";

export class CommentService {
    constructor(private readonly commentRepository: CommentRepository,
         private readonly postRepository: PostRepository) {}

    async create(input: CreateCommentInput): Promise<Comment> {
        const post = await this.postRepository.findById(input.postId);

        if (!post) { throw new HttpError("Post not found", 404); }

        if (post.isDeleted) { throw new HttpError("Post is deleted", 404); }

        const comment: Comment = {
            commentId: randomUUID(),
            postId: input.postId,
            userId: input.userId,
            content: input.content,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: null
        };

        const totalComments = post.totalComments + 1;

        await Promise.all([
            this.commentRepository.createCommentById(comment),
            this.commentRepository.createCommentByPost(comment),
            this.commentRepository.createCommentByUser(comment),

            this.postRepository.updateTotalCommentsById(totalComments, post.postId),
            this.postRepository.updateTotalCommentsByUser(post.userId, post.createdAt, totalComments, post.postId),
        ]);

        if (post.establishmentId){
           await this.postRepository.updateTotalCommentsByEstablishment(post.establishmentId, post.createdAt,
            totalComments, post.postId);
        }

        await producer.send({
            topic: 'post.commented',
            messages: [{
                key: comment.postId,
                value: JSON.stringify({
                    postId: comment.postId,
                    postOwnerId: post.userId,
                    commentedByUserId: comment.userId,
                    content: comment.content,
                }),
            }],
        });

        return comment;
    }

    async findByPost(postId: string, limit = 50): Promise<Comment[]> {
        return this.commentRepository.findByPost(postId, limit);
    }

    async findByUser(userId: string, limit = 50): Promise<Comment[]> {
        return this.commentRepository.findByUser(userId, limit);
    }

    async findById(commentId: string): Promise<Comment | null> {
        return this.commentRepository.findById(commentId);
    }

    async update(input: UpdateCommentInput, currentUserId: string): Promise<Comment> {
        const comment = await this.commentRepository.findById(input.commentId);

        if (!comment) { throw new HttpError("Comment not found", 404); }

        if (comment.userId != currentUserId) { throw new HttpError("You cannot update this comment.", 403); }

        if (comment.isDeleted) { throw new HttpError("Comment is deleted", 404); }

        const updatedAt = new Date();

        await Promise.all([
            this.commentRepository.updateCommentById(comment.commentId, input.content, updatedAt),

            this.commentRepository.updateCommentByPost(comment.postId, comment.createdAt, comment.commentId,
                input.content, updatedAt),

            this.commentRepository.updateCommentByUser(comment.userId, comment.createdAt, comment.commentId,
                input.content, updatedAt)
        ]);

        return {
            ...comment,
            content: input.content,
            updatedAt
        };
    }

    async softDelete(
        commentId: string,
        currentUserId: string
    ): Promise<void> {
        const comment = await this.commentRepository.findById(commentId);

        if (!comment) { throw new HttpError("Comment not found", 404); }

        if (comment.userId != currentUserId) { throw new HttpError("You cannot delete this comment.", 403); }

        if (comment.isDeleted) { throw new HttpError("Comment already deleted", 409); }

        const post = await this.postRepository.findById(comment.postId);

        if (post?.isDeleted) { throw new HttpError("Post deleted", 404); }

        const totalComments = Math.max(0, (post?.totalComments ?? 0) - 1);

        if ((post?.totalComments ?? 0) <= 0) {
            throw new HttpError("Inconsistent comment count", 400);
        }

        await Promise.all([
            this.commentRepository.softDeleteCommentById(comment.commentId),
            this.commentRepository.softDeleteCommentByPost(comment.postId, comment.createdAt, comment.commentId),
            this.commentRepository.softDeleteCommentByUser(comment.userId, comment.createdAt, comment.commentId),
        ]);

        if (post){
            await Promise.all([
                this.postRepository.updateTotalCommentsById(totalComments, comment.postId),
                this.postRepository.updateTotalCommentsByUser(post.userId, post.createdAt, totalComments, comment.postId)
            ]);
        }

        if (post && post.establishmentId){
            await this.postRepository.updateTotalCommentsByEstablishment(post.establishmentId, post.createdAt, totalComments, post.postId);
        }
    }
}
