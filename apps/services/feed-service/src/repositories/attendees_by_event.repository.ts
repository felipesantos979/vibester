import { BaseRepository } from "./base.repository";

export class EventAttendeesRepository extends BaseRepository {

    async create(eventId: string, userId: string, ttl: number) {
        return this.execute(
            `
                INSERT INTO feed_keyspace.attendees_by_event (
                    event_id,
                    user_id,
                    confirmed_at
                )
                VALUES (?, ?, ?)
                USING TTL ?;
            `,
            [eventId, userId, new Date(), ttl]
        );
    }

    async findAttendeesByEvent(eventId: string): Promise<string[]> {
        const result = await this.execute(
            `
                SELECT user_id
                FROM feed_keyspace.attendees_by_event
                WHERE event_id = ?;
            `,
            [eventId]
        );

        return result.rows.map(
            row => row.user_id.toString()
        );
    }

    async delete(eventId: string, userId: string) {
        return this.execute(
            `
                DELETE FROM feed_keyspace.attendees_by_event
                WHERE event_id = ?
                    AND user_id = ?;
            `,
            [eventId, userId]
        );
    }
}