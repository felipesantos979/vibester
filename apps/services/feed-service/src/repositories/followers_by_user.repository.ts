import { BaseRepository } from "./base.repository";

export class UserFollowerRepository extends BaseRepository {
  async create(userId: string, followerId: string) {
    return this.execute(
      `
        INSERT INTO feed_keyspace.followers_by_user (
          user_id,
          follower_id,
          followed_at
        )
        VALUES (?, ?, ?);
      `,
      [userId, followerId, new Date()]
    );
  }

  async findFollowersByUser(userId: string): Promise<string[]> {
    const result = await this.execute(
      `
        SELECT follower_id
        FROM feed_keyspace.followers_by_user
        WHERE user_id = ?;
      `,
      [userId]
    );

    return result.rows.map((row) => row.follower_id.toString());
  }

  async delete(userId: string, followerId: string) {
    return this.execute(
      `
        DELETE FROM feed_keyspace.followers_by_user
        WHERE user_id = ?
        AND follower_id = ?;
      `,
      [userId, followerId]
    );
  }
}