import { FastifyInstance } from "fastify";
import { FeedController } from "./controllers/feed.controller";

const feedController = new FeedController();

export async function feedRoutes(app: FastifyInstance) {
  app.get("/feed/:userId", feedController.getFeedByUser);
}