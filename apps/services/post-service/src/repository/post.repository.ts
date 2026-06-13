import { Post } from "../types/post.types";
import { BaseRepository } from "./base.repository";

export class PostRepository extends BaseRepository {

    async createPostById(post: Post) {
        return this.execute(
            `
                INSERT INTO posts_by_id (
                    post_id,
                    user_id,
                    establishment_id,
                    image_urls,
                    caption,
                    total_likes,
                    total_comments,
                    is_deleted,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                post.postId,
                post.userId,
                post.establishmentId ?? null,
                post.imageUrls,
                post.caption,
                post.totalLikes,
                post.totalComments,
                post.isDeleted,
                post.createdAt
            ]
        );
    }

    async createPostByUser(post: Post) {
        return this.execute(
            `
                INSERT INTO posts_by_user (
                    user_id,
                    created_at,
                    post_id,
                    establishment_id,
                    caption,
                    is_deleted,
                    total_comments,
                    total_likes,
                    image_urls
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [
            post.userId,
            post.createdAt,
            post.postId,
            post.establishmentId ?? null,
            post.caption,
            post.isDeleted,
            post.totalComments,
            post.totalLikes,
            post.imageUrls
        ]);
    }

    async createPostByEstablishment(post: Post) {
        if (!post.establishmentId) { return; }

        return this.execute(
            `
                INSERT INTO posts_by_establishment (
                    establishment_id,
                    created_at,
                    post_id,
                    user_id,
                    image_urls,
                    caption,
                    total_likes,
                    total_comments,
                    is_deleted
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                post.establishmentId,
                post.createdAt,
                post.postId,
                post.userId,
                post.imageUrls,
                post.caption,
                post.totalLikes,
                post.totalComments,
                post.isDeleted
            ]
        );
    }

    async findById(postId: string): Promise<Post | null> {
        const result = await this.execute(
            `
                SELECT *
                FROM posts_by_id
                WHERE post_id = ?;
            `,
            [postId]
        );

        const row = result.rows[0];

        if (!row) { return null; }

        return {
            postId: row.post_id,
            userId: row.user_id,
            establishmentId: row.establishment_id,
            imageUrls: row.image_url,
            caption: row.caption,
            totalLikes: row.total_likes,
            totalComments: row.total_comments,
            isDeleted: row.is_deleted,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async findByUser(userId: string) {
        const result = await this.execute(
            `
                SELECT *
                FROM posts_by_user
                WHERE user_id = ?;
             `,
            [userId]
        );

        return result.rows;
    }

    async findByEstablishment(estblishmentId: string){
        const result = await this.execute(
            `
                SELECT *
                FROM posts_by_establishment
                WHERE establishment_id = ?;
            `,
            [estblishmentId]
        );

        return result.rows;
    }

    async updateCaptionById(postId: string, caption: string, updatedAt: Date) {
        return this.execute(
            `
                UPDATE posts_by_id
                SET caption = ?,
                    updated_at = ?
                WHERE post_id = ?;
            `,
            [caption, updatedAt, postId]
        );
    }

    async updateCaptionByUser(userId: string, createdAt: Date, postId: string, caption: string, updatedAt: Date) {
        return this.execute(
            `
                UPDATE posts_by_user
                SET caption = ?,
                    updated_at = ?
                WHERE user_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [caption, updatedAt, userId, createdAt, postId]
        );
    }

    async updateCaptionByEstablishment(establishmentId: string, createdAt: Date, postId: string, caption: string, updatedAt: Date) {
        return this.execute(
            `
                UPDATE posts_by_establishment
                SET caption = ?,
                    updated_at = ?
                WHERE establishment_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [
                caption,
                updatedAt,
                establishmentId,
                createdAt,
                postId
            ]
        );
    }

    async softDeleteById(postId: string) {
        return this.execute(
            `
                UPDATE posts_by_id
                SET is_deleted = true
                WHERE post_id = ?;
            `,
            [postId]
        );
    }

    async softDeleteByUser(userId: string, createdAt: Date, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_user
                SET is_deleted = true
                WHERE user_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [userId, createdAt, postId]);
    }

    async softDeleteByEstablishment(establishmentId: string, createdAt: Date, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_establishment
                SET is_deleted = true
                WHERE establishment_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [establishmentId, createdAt, postId]
        );
    }

    async updateTotalLikesById(total_likes: number, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_id
                SET total_likes = ?
                WHERE post_id = ?;
             `,
            [total_likes, postId]
        );
    }

    async updateTotalLikesByUser(userId: string, createdAt: Date, total_likes: number, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_user
                SET total_likes = ?
                WHERE user_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [total_likes, userId, createdAt, postId]
        );
    }

    async updateTotalLikesByEstablishment(establishmentId: string, createdAt: Date, 
        totalLikes: number, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_establishment
                SET total_likes = ?
                WHERE establishment_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [
                totalLikes,
                establishmentId,
                createdAt,
                postId
            ]
        );
    }

    async updateTotalCommentsById(totalComments: number, postId: string){
        return this.execute(
            `
                UPDATE posts_by_id
                SET total_comments = ?
                WHERE post_id = ?;
            `,
            [totalComments, postId]
        );
    }

     async updateTotalCommentsByUser(userId: string, createdAt: Date, totalComments: number, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_user
                SET total_comments = ?
                WHERE user_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [totalComments, userId, createdAt, postId]
        );
    }

    async updateTotalCommentsByEstablishment(establishmentId: string, createdAt: Date, 
        totalComments: number, postId: string) {
        return this.execute(
            `
                UPDATE posts_by_establishment
                SET total_comments = ?
                WHERE establishment_id = ?
                AND created_at = ?
                AND post_id = ?;
            `,
            [
                totalComments,
                establishmentId,
                createdAt,
                postId
            ]
        );
    }
}