import { BaseRepository } from "./base.repository";

export class EstablishmentFollowersRepository extends BaseRepository {
  async create(establishmentId: string, followerId: string) {
    return this.execute(
      `
        INSERT INTO feed_keyspace.followers_by_establishment (
          establishment_id,
          follower_id,
          followed_at
        )
        VALUES (?, ?, ?);
      `,
      [establishmentId, followerId, new Date()]
    );
  }

  async findFollowersByEstablishment(establishmentId: string): Promise<string[]> {
    const result = await this.execute(
      `
        SELECT follower_id
        FROM feed_keyspace.followers_by_establishment
        WHERE establishment_id = ?;
      `,
      [establishmentId]
    );

    return result.rows.map(
      row => row.follower_id.toString()
    );
  }

  async delete(establishmentId: string, followerId: string) {
    return this.execute(
      `
        DELETE FROM feed_keyspace.followers_by_establishment
        WHERE establishment_id = ?
          AND follower_id = ?;
      `,
      [establishmentId, followerId]
    );
  }
}