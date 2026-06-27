import { Event } from "../types/event.type";
import { BaseRepository } from "./base.repository";

export class EventsByUserRepository extends BaseRepository {

    async create(event: Event, ttl: number) {
        return this.execute(
            `
                INSERT INTO feed_keyspace.events_by_user (
                    author_id,

                    created_at,
                    event_id,

                    author_username,
                    author_profile_picture,
                    author_verified,

                    establishment_id,
                    establishment_name,
                    establishment_logo,
                    establishment_category,

                    event_title,
                    event_banner,
                    event_lineup,
                    event_location,
                    event_date,
                    event_organizer_name,
                    event_organizer_logo,

                    total_confirmed,
                    is_deleted,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                USING TTL ?;
            `,
            [
                event.authorId,

                event.createdAt,
                event.eventId,

                event.authorUsername,
                event.authorProfilePicture,
                event.authorVerified,

                event.establishmentId,
                event.establishmentName,
                event.establishmentLogo,
                event.establishmentCategory,

                event.title,
                event.banner,
                event.lineup,
                event.location,
                event.date,
                event.organizerName,
                event.organizerLogo,

                event.totalConfirmed,
                event.isDeleted,
                event.updatedAt,

                ttl
            ]
        );
    }

    async findRecentEventsByAuthor(authorId: string, since: Date) {
        return this.execute(
            `
                SELECT *
                FROM feed_keyspace.events_by_user
                WHERE author_id = ?
                    AND created_at >= ?
                LIMIT 15;
            `,
            [authorId, since]
        );
    }

    async updateStats(authorId: string, eventDate: Date, eventId: string, totalConfirmed: number) {
        return this.execute(
            `
                UPDATE feed_keyspace.events_by_user
                SET
                    total_confirmed = ?
                WHERE author_id = ?
                    AND created_at = ?
                    AND event_id = ?;
            `,
            [totalConfirmed, authorId, eventDate, eventId]
        );
    }

    async softDelete(authorId: string, eventDate: Date, eventId: string) {
        return this.execute(
            `
                UPDATE feed_keyspace.events_by_user
                SET
                    is_deleted = true
                WHERE author_id = ?
                    AND created_at = ?
                    AND event_id = ?;
            `,
            [authorId, eventDate, eventId]
        );
    }

    async delete(authorId: string, eventDate: Date, eventId: string) {
        return this.execute(
            `
                DELETE
                FROM feed_keyspace.events_by_user
                WHERE author_id = ?
                    AND created_at = ?
                    AND event_id = ?;
            `,
            [authorId, eventDate, eventId]
        );
    }
}