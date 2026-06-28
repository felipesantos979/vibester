import { randomUUID } from "crypto";

import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../repository/post.repository";
import { Comment, CreateCommentInput, UpdateCommentInput } from "../types/comment.type";
import { producer } from "../kafka/producer";

export class CommentService {
    constructor(private readonly commentRepository: CommentRepository,
         private readonly postRepository: PostRepository) {}

    async create(input: CreateCommentInput): Promise<Comment> {
        const post = await this.postRepository.findById(input.postId);

        if (!post) { throw new Error("Post not found"); }

        if (post.isDeleted) { throw new Error("Post is deleted"); }

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

    async findByPost(postId: string): Promise<Comment[]> {
        return this.commentRepository.findByPost(postId);
    }

    async findByUser(userId: string): Promise<Comment[]> {
        return this.commentRepository.findByUser(userId);
    }

    async findById(commentId: string): Promise<Comment | null> {
        return this.commentRepository.findById(commentId);
    }

    async update(input: UpdateCommentInput, currentUserId: string): Promise<Comment> {
        const comment = await this.commentRepository.findById(input.commentId);

        if (!comment) { throw new Error("Comment not found"); }

        if (comment.userId != currentUserId) { throw new Error("You cannot update this comment."); }

        if (comment.isDeleted) { throw new Error("Comment is deleted"); }

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

        if (!comment) { throw new Error("Comment not found"); }

        if (comment.userId != currentUserId) { throw new Error("You cannot delete this comment."); }

        if (comment.isDeleted) { throw new Error("Comment already deleted"); }

        const post = await this.postRepository.findById(comment.postId);

        if (post?.isDeleted) { throw new Error("Post deleted"); }

        let totalComments = post?.totalComments ?? 0;

        if (totalComments && totalComments > 0){
            totalComments = totalComments - 1;
        } else if (totalComments && totalComments <= 0){
            throw new Error("Post has zero comments!");
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