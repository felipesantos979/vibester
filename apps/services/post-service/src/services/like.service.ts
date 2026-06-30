import { randomUUID } from "crypto";
import { LikeRepository } from "../repository/like.repository";
import { PostRepository } from "../repository/post.repository";
import { PostLike } from "../types/like.types";
import { producer } from "../kafka/producer";
import { HttpError } from "../errors/http.error";

export class LikeService {
    constructor(private readonly likeRepository: LikeRepository, private readonly postRepository: PostRepository) {}

    async likePost(postId: string, userId: string): Promise<PostLike> {
        const post = await this.postRepository.findById(postId);

        if (!post) { throw new HttpError("Post not found", 404); }

        if (post.isDeleted) { throw new HttpError("Post is deleted", 404); }

        const existingLike = await this.likeRepository.findLikeByPostAndUser(postId, userId);

        if (existingLike) { throw new HttpError("Post already liked", 409); }

        const like: PostLike = {
            postId,
            userId,
            likedAt: new Date()
        };

        const total_likes = post.totalLikes + 1;

        await Promise.all([
            this.likeRepository.createLikeByPost(like),
            this.likeRepository.createLikeByUser(like),
            this.postRepository.updateTotalLikesById(total_likes, postId),
            this.postRepository.updateTotalLikesByUser(post.userId, post.createdAt, total_likes, postId)
        ]);

        if (post.establishmentId) {
            await this.postRepository.updateTotalLikesByEstablishment(post.establishmentId, post.createdAt,
                 total_likes, post.postId);
        }

        await Promise.all([
            producer.send({
                topic: 'post.liked',
                messages: [{
                    key: postId,
                    value: JSON.stringify({
                        postId,
                        userId,
                        createdAt: like.likedAt.toISOString(),
                    }),
                }],
            }),
            producer.send({
                topic: 'posts',
                messages: [{
                    key: postId,
                    value: JSON.stringify({
                        eventId: randomUUID(),
                        eventType: 'post.stats.updated',
                        occurredAt: new Date().toISOString(),
                        data: {
                            authorId: post.userId,
                            postId,
                            createdAt: post.createdAt.toISOString(),
                            totalLikes: total_likes,
                            totalComments: post.totalComments,
                        },
                    }),
                }],
            }),
        ]);

        return like;
    }

    async unlikePost(postId: string, userId: string): Promise<void> {
        const post = await this.postRepository.findById(postId);

        if (!post) { throw new HttpError("Post not found", 404); }

        const existingLike = await this.likeRepository.findLikeByPostAndUser(postId, userId);

        if (!existingLike) { throw new HttpError("Like not found", 404); }

        if (post.totalLikes <= 0) {
            throw new HttpError("Inconsistent like count", 400);
        }

        const totalLikes = post.totalLikes - 1;

        await Promise.all([
            this.likeRepository.deleteLikeByPost(postId, userId),
            this.likeRepository.deleteLikeByUser(userId, existingLike.likedAt, postId),
            this.postRepository.updateTotalLikesById(totalLikes, postId),
            this.postRepository.updateTotalLikesByUser(post.userId, post.createdAt, totalLikes, postId)
        ]);

        if (post.establishmentId){
            await this.postRepository.updateTotalLikesByEstablishment(post.establishmentId, post.createdAt,
                 totalLikes, post.postId);
        }

        await Promise.all([
            producer.send({
                topic: 'post.unliked',
                messages: [{
                    key: postId,
                    value: JSON.stringify({
                        postId,
                        userId,
                        createdAt: existingLike.likedAt.toISOString(),
                    }),
                }],
            }),
            producer.send({
                topic: 'posts',
                messages: [{
                    key: postId,
                    value: JSON.stringify({
                        eventId: randomUUID(),
                        eventType: 'post.stats.updated',
                        occurredAt: new Date().toISOString(),
                        data: {
                            authorId: post.userId,
                            postId,
                            createdAt: post.createdAt.toISOString(),
                            totalLikes: totalLikes,
                            totalComments: post.totalComments,
                        },
                    }),
                }],
            }),
        ]);
    }

    async findLikesByUser(userId: string, limit = 50): Promise<PostLike[]> {
        return this.likeRepository.findLikesByUser(userId, limit);
    }

    async findLikesByPost(postId: string, limit = 50): Promise<PostLike[]> {
        return this.likeRepository.findLikesByPost(postId, limit);
    }
}
