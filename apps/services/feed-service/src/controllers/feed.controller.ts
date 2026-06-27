import { FastifyReply, FastifyRequest } from "fastify";
import { FeedService } from "../services/feed.service";

const feedService = new FeedService();

interface GetFeedParams { userId: string; }

interface GetFeedQuery {
  limit?: string;
  cursor?: string;
}

export class FeedController {
  async getFeedByUser(
    request: FastifyRequest<{
      Params: GetFeedParams;
      Querystring: GetFeedQuery;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;

      const limit = request.query.limit ? Number(request.query.limit) : 20;

      const cursor = request.query.cursor ? new Date(request.query.cursor) : undefined;

      if (!userId) {
        return reply.status(400).send({
          message: "User id is required",
        });
      }

      if (Number.isNaN(limit) || limit <= 0 || limit > 50) {
        return reply.status(400).send({
          message: "Invalid limit",
        });
      }

      if (request.query.cursor && cursor && Number.isNaN(cursor.getTime())) {
        return reply.status(400).send({
          message: "Invalid cursor",
        });
      }

      const feed = await feedService.getFeedByUser(userId, limit, cursor);

      return reply.status(200).send(feed);
    } catch (error) {
      console.error(error);

      return reply.status(500).send({
        message: "Internal server error",
      });
    }
  }
}