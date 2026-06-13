import { Comment } from "../types/comment.type";
import { BaseRepository } from "./base.repository";

export class CommentRepository extends BaseRepository {

    async createCommentByPost(comment: Comment) {
        return this.execute(
            `
                INSERT INTO comments_by_post (
                    post_id,
                    created_at,
                    comment_id,
                    user_id,
                    content,
                    is_deleted,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [
                comment.postId,
                comment.createdAt,
                comment.commentId,
                comment.userId,
                comment.content,
                comment.isDeleted,
                comment.updatedAt ?? null
            ]
        );
    }

    async createCommentByUser(comment: Comment) {
        return this.execute(
            `
                INSERT INTO comments_by_user (
                    user_id,
                    created_at,
                    comment_id,
                    post_id,
                    content,
                    is_deleted,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [
                comment.userId,
                comment.createdAt,
                comment.commentId,
                comment.postId,
                comment.content,
                comment.isDeleted,
                comment.updatedAt ?? null
            ]
        );
    }

    async findByPost(postId: string): Promise<Comment[]> {
        const result = await this.execute(
            `
                SELECT *
                FROM comments_by_post
                WHERE post_id = ?;
            `,
            [postId]
        );

        return result.rows.map((row) => ({
            commentId: row.comment_id,
            postId: row.post_id,
            userId: row.user_id,
            content: row.content,
            isDeleted: row.is_deleted,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }

    async findByUser(userId: string): Promise<Comment[]> {
        const result = await this.execute(
            `
                SELECT *
                FROM comments_by_user
                WHERE user_id = ?;
            `,
            [userId]
        );

        return result.rows.map((row) => ({
            commentId: row.comment_id,
            postId: row.post_id,
            userId: row.user_id,
            content: row.content,
            isDeleted: row.is_deleted,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }

    async updateCommentByPost(
        postId: string,
        createdAt: Date,
        commentId: string,
        content: string,
        updatedAt: Date
    ) {
        return this.execute(
            `
                UPDATE comments_by_post
                SET content = ?,
                    updated_at = ?
                WHERE post_id = ?
                AND created_at = ?
                AND comment_id = ?;
            `,
            [content, updatedAt, postId, createdAt, commentId]
        );
    }

    async updateCommentByUser(
        userId: string,
        createdAt: Date,
        commentId: string,
        content: string,
        updatedAt: Date
    ) {
        return this.execute(
            `
                UPDATE comments_by_user
                SET content = ?,
                    updated_at = ?
                WHERE user_id = ?
                AND created_at = ?
                AND comment_id = ?;
            `,
            [content, updatedAt, userId, createdAt, commentId]
        );
    }

    async softDeleteCommentByPost(
        postId: string,
        createdAt: Date,
        commentId: string
    ) {
        return this.execute(
            `
                UPDATE comments_by_post
                SET is_deleted = true
                WHERE post_id = ?
                AND created_at = ?
                AND comment_id = ?;
            `,
            [postId, createdAt, commentId]
        );
    }

    async softDeleteCommentByUser(
        userId: string,
        createdAt: Date,
        commentId: string
    ) {
        return this.execute(
            `
                UPDATE comments_by_user
                SET is_deleted = true
                WHERE user_id = ?
                AND created_at = ?
                AND comment_id = ?;
            `,
            [userId, createdAt, commentId]
        );
    }

    async createCommentById(comment: Comment) {
        return this.execute(
            `
                INSERT INTO comments_by_id (
                    comment_id,
                    post_id,
                    user_id,
                    content,
                    is_deleted,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [
                comment.commentId,
                comment.postId,
                comment.userId,
                comment.content,
                comment.isDeleted,
                comment.createdAt,
                comment.updatedAt ?? null
            ]
        );
    }

    async findById(commentId: string): Promise<Comment | null> {
        const result = await this.execute(
            `
                SELECT *
                FROM comments_by_id
                WHERE comment_id = ?;
            `,
            [commentId]
        );

        const row = result.rows[0];

        if (!row) { return null; }

        return {
            commentId: row.comment_id,
            postId: row.post_id,
            userId: row.user_id,
            content: row.content,
            isDeleted: row.is_deleted,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async updateCommentById(
        commentId: string,
        content: string,
        updatedAt: Date
    ) {
        return this.execute(
            `
                UPDATE comments_by_id
                SET content = ?,
                    updated_at = ?
                WHERE comment_id = ?;
            `,
            [content, updatedAt, commentId]
        );
    }

    async softDeleteCommentById(commentId: string) {
        return this.execute(
            `
                UPDATE comments_by_id
                SET is_deleted = true
                WHERE comment_id = ?;
            `,
            [commentId]
        );
    }
}