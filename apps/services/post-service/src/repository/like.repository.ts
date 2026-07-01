import { BaseRepository } from "./base.repository";
import { PostLike } from "../types/like.types";

export class LikeRepository extends BaseRepository {

    async createLikeByPost(like: PostLike) {
        return this.execute(
            `
            INSERT INTO likes_by_post (
                post_id,
                user_id,
                liked_at
            )
            VALUES (?, ?, ?);
            `,
            [like.postId, like.userId, like.likedAt]
        );
    }

    async createLikeByUser(like: PostLike) {
        return this.execute(
            `
                INSERT INTO likes_by_user (
                    user_id,
                    liked_at,
                    post_id
                )
                VALUES (?, ?, ?);
            `,
            [like.userId, like.likedAt, like.postId]
        );
    }

    async findLikeByPostAndUser(postId: string, userId: string): Promise<PostLike | null> {
        const result = await this.execute(
            `
                SELECT *
                FROM likes_by_post
                WHERE post_id = ?
                AND user_id = ?;
            `,
            [postId, userId]
        );

        const row = result.rows[0];

        if (!row) { return null; }

        return {
            postId: row.post_id,
            userId: row.user_id,
            likedAt: row.liked_at
        };
    }

    // Usado pra marcar isLiked em uma lista de posts sem N+1: uma query só,
    // usando IN na partition key (post_id) do lado do usuário que está vendo.
    async findLikedPostIds(postIds: string[], userId: string): Promise<Set<string>> {
        if (postIds.length === 0) { return new Set(); }

        const result = await this.execute(
            `
                SELECT post_id
                FROM likes_by_post
                WHERE post_id IN ?
                AND user_id = ?;
            `,
            [postIds, userId]
        );

        return new Set(result.rows.map((row) => row.post_id));
    }

    async findLikesByPost(postId: string, limit = 50): Promise<PostLike[]> {
        const result = await this.execute(
            `
                SELECT *
                FROM likes_by_post
                WHERE post_id = ?
                LIMIT ?;
            `,
            [postId, limit]
        );

        return result.rows.map((row) => ({
            postId: row.post_id,
            userId: row.user_id,
            likedAt: row.liked_at
        }));
    }

    async findLikesByUser(userId: string, limit = 50): Promise<PostLike[]> {
        const result = await this.execute(
            `
                SELECT *
                FROM likes_by_user
                WHERE user_id = ?
                LIMIT ?;
            `,
            [userId, limit]
        );

        return result.rows.map((row) => ({
            postId: row.post_id,
            userId: row.user_id,
            likedAt: row.liked_at
        }));
    }

    async deleteLikeByPost(postId: string, userId: string) {
        return this.execute(
            `
                DELETE FROM likes_by_post
                WHERE post_id = ?
                AND user_id = ?;
            `,
            [postId, userId]
        );
    }

    async deleteLikeByUser(userId: string, likedAt: Date, postId: string) {
        return this.execute(
            `
            DELETE FROM likes_by_user
            WHERE user_id = ?
            AND liked_at = ?
            AND post_id = ?;
            `,
            [userId, likedAt, postId]
        );
    }
}
