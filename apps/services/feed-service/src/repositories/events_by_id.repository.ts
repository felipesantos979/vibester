import { BaseRepository } from "./base.repository";
import { FeedItem } from "../types/feed.types";
import { Event } from "../types/event.type";

export class EventsByIdRepository extends BaseRepository {

    async create(event: Omit<FeedItem, "userId">, ttl: number) {
        return this.execute(
            `
                INSERT INTO feed_keyspace.events_by_id (
                    event_id,
                    created_at,

                    author_id,
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
                    event_date,
                    event_location,
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
                event.eventId,
                event.createdAt,

                event.authorId,
                event.authorUsername,
                event.authorProfilePicture,
                event.authorVerified,

                event.establishmentId,
                event.establishmentName,
                event.establishmentLogo,
                event.establishmentCategory,

                event.eventTitle,
                event.eventBanner,
                event.eventLineup,
                event.eventDate,
                event.eventLocation,
                event.eventOrganizerName,
                event.eventOrganizerLogo,

                event.totalConfirmed,
                event.isDeleted,
                event.updatedAt,

                ttl
            ]
        );
    }

    async findById(eventId: string): Promise<Event | null> {
        const result = await this.execute(
            `
                SELECT *
                FROM feed_keyspace.events_by_id
                WHERE event_id = ?;
            `,
            [eventId]
        );

        const row = result.rows[0];

        if (!row) {
            return null;
        }

        return this.rowToEvent(row);
    }

    async update(event: Omit<FeedItem, "userId">) {
        return this.execute(
            `
                UPDATE feed_keyspace.events_by_id
                SET
                    event_title = ?,
                    event_banner = ?,
                    event_lineup = ?,
                    event_date = ?,
                    event_location = ?,
                    event_organizer_name = ?,
                    event_organizer_logo = ?,

                    total_confirmed = ?,
                    updated_at = ?
                WHERE event_id = ?;
            `,
            [
                event.eventTitle,
                event.eventBanner,
                event.eventLineup,
                event.eventDate,
                event.eventLocation,
                event.eventOrganizerName,
                event.eventOrganizerLogo,

                event.totalConfirmed,
                event.updatedAt,

                event.eventId
            ]
        );
    }

    async updateTotalConfirmed(eventId: string, totalConfirmed: number) {
        return this.execute(
            `
                UPDATE feed_keyspace.events_by_id
                SET total_confirmed = ?
                WHERE event_id = ?;
            `,
            [totalConfirmed, eventId]
        );
    }

    async softDelete(eventId: string) {
        return this.execute(
            `
                UPDATE feed_keyspace.events_by_id
                SET is_deleted = true
                WHERE event_id = ?;
            `,
            [eventId]
        );
    }

    async delete(eventId: string) {
        return this.execute(
            `
                DELETE
                FROM feed_keyspace.events_by_id
                WHERE event_id = ?;
            `,
            [eventId]
        );
    }

     private rowToEvent(row: any): Event {
            return {
                eventId: row.event_id,
                createdAt: row.created_at,
                // autor
                authorId: row.author_id,
                authorUsername: row.author_username,
                authorProfilePicture: row.author_profile_picture,
                authorVerified: row.author_verified,
    
                // estabelecimento
                establishmentId: row.establishment_id,
                establishmentName: row.establishment_name,
                establishmentLogo: row.establishment_logo,
                establishmentCategory: row.establishment_category,
    
                // evento
                title: row.event_title,
                banner: row.event_banner,
                lineup: row.event_lineup,
                date: row.event_date,
                location: row.event_location,
                organizerName: row.event_organizer_name,
                organizerLogo: row.event_organizer_logo,
    
                // estatísticas
                totalConfirmed: row.total_confirmed,
    
                // controle
                isDeleted: row.is_deleted,
                updatedAt: row.updated_at
            };
        }
}