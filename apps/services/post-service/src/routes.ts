import { FastifyInstance } from "fastify";

import { PostRepository } from "./repository/post.repository";
import { PostService } from "./services/post.service";
import { PostController } from "./controller/post.controller";
import { LikeRepository } from "./repository/like.repository";
import { LikeController } from "./controller/like.controller";
import { LikeService } from "./services/like.service";
import { CommentRepository } from "./repository/comment.repository";
import { CommentService } from "./services/comment.service";
import { CommentController } from "./controller/comment.controller";
import { UploadService } from "./services/upload.service";

export async function routes(app: FastifyInstance) {

    const uploadService = new UploadService();
    const postRepository = new PostRepository();
    const postService = new PostService(postRepository, uploadService);
    const postController = new PostController(postService);

    const likeRepository = new LikeRepository();
    const likeService = new LikeService(likeRepository, postRepository);
    const likeController = new LikeController(likeService);

    const commentRepository = new CommentRepository();
    const commentService = new CommentService(commentRepository, postRepository);
    const commentController = new CommentController(commentService);

    //rota de posts
    app.post("/posts", postController.create.bind(postController));

    app.get("/posts/:postId", postController.findById.bind(postController));

    app.get("/users/:userId/posts", postController.findByUser.bind(postController));

    app.get("/establishments/:establishmentId/posts", postController.findByEstablishment.bind(postController));

    app.patch("/posts/:postId", postController.updateCaption.bind(postController));

    app.delete("/posts/:postId", postController.softDelete.bind(postController));

    //rota de likes
    app.post("/posts/:postId/likes", likeController.likePost.bind(likeController));

    app.delete("/posts/:postId/likes", likeController.unlikePost.bind(likeController));

    app.get("/users/:userId/likes", likeController.findLikesByUser.bind(likeController));

    app.get("/posts/:postId/likes", likeController.findLikesByPost.bind(likeController));

    //rota de comentários
    app.post("/comments", commentController.create.bind(commentController));

    app.get("/posts/:postId/comments", commentController.findByPost.bind(commentController));

    app.get("/users/:userId/comments", commentController.findByUser.bind(commentController));

    app.patch("/comments/:commentId", commentController.update.bind(commentController));

    app.delete("/comments/:commentId", commentController.softDelete.bind(commentController));
}