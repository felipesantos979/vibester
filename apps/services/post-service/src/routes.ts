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

const postSchema = {
    type: "object",
    properties: {
        postId: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        establishmentId: { type: "string", format: "uuid", nullable: true },
        imageUrls: { type: "array", items: { type: "string", format: "uri" } },
        caption: { type: "string" },
        totalLikes: { type: "integer" },
        totalComments: { type: "integer" },
        isDeleted: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time", nullable: true },
    },
};

const commentSchema = {
    type: "object",
    properties: {
        commentId: { type: "string", format: "uuid" },
        postId: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        content: { type: "string" },
        isDeleted: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time", nullable: true },
    },
};

const likeSchema = {
    type: "object",
    properties: {
        postId: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        likedAt: { type: "string", format: "date-time" },
    },
};

const errorSchema = {
    type: "object",
    properties: { message: { type: "string" } },
};

const postIdParam = {
    type: "object",
    required: ["postId"],
    properties: { postId: { type: "string", format: "uuid" } },
};

const userIdParam = {
    type: "object",
    required: ["userId"],
    properties: { userId: { type: "string", format: "uuid" } },
};

export async function routes(app: FastifyInstance) {
    app.get("/health", {
        schema: {
            tags: ["Health"],
            summary: "Health check",
            response: { 200: { type: "object", properties: { status: { type: "string", example: "ok" } } } },
        },
    }, async (_request, reply) => reply.status(200).send({ status: "ok" }));

    const postRepository = new PostRepository();
    const postService = new PostService(postRepository);
    const postController = new PostController(postService);

    const likeRepository = new LikeRepository();
    const likeService = new LikeService(likeRepository, postRepository);
    const likeController = new LikeController(likeService);

    const commentRepository = new CommentRepository();
    const commentService = new CommentService(commentRepository, postRepository);
    const commentController = new CommentController(commentService);

    //rota de posts
    app.post("/posts", {
        schema: {
            tags: ["Posts"],
            summary: "Criar post",
            body: {
                type: "object",
                required: ["userId", "imageUrls"],
                properties: {
                    userId: { type: "string", format: "uuid" },
                    establishmentId: { type: "string", format: "uuid" },
                    imageUrls: { type: "array", items: { type: "string", format: "uri" }, minItems: 1, maxItems: 20 },
                    caption: { type: "string", maxLength: 250 },
                },
            },
            response: { 201: postSchema, 400: errorSchema },
        },
    }, postController.create.bind(postController));

    app.get("/posts/:postId", {
        schema: {
            tags: ["Posts"],
            summary: "Buscar post por ID",
            params: postIdParam,
            response: { 200: postSchema, 404: errorSchema },
        },
    }, postController.findById.bind(postController));

    app.get("/users/:userId/posts", {
        schema: {
            tags: ["Posts"],
            summary: "Listar posts de um usuário",
            params: userIdParam,
            response: { 200: { type: "array", items: postSchema } },
        },
    }, postController.findByUser.bind(postController));

    app.get("/establishments/:establishmentId/posts", {
        schema: {
            tags: ["Posts"],
            summary: "Listar posts de um estabelecimento",
            params: {
                type: "object",
                required: ["establishmentId"],
                properties: { establishmentId: { type: "string", format: "uuid" } },
            },
            response: { 200: { type: "array", items: postSchema } },
        },
    }, postController.findByEstablishment.bind(postController));

    app.patch("/posts/:postId", {
        schema: {
            tags: ["Posts"],
            summary: "Atualizar legenda",
            params: postIdParam,
            body: {
                type: "object",
                required: ["caption"],
                properties: { caption: { type: "string", maxLength: 250 } },
            },
            response: { 200: postSchema, 400: errorSchema },
        },
    }, postController.updateCaption.bind(postController));

    app.delete("/posts/:postId", {
        schema: {
            tags: ["Posts"],
            summary: "Remover post (soft delete)",
            params: postIdParam,
            response: { 204: { type: "null", description: "Removido com sucesso" } },
        },
    }, postController.softDelete.bind(postController));

    //rota de likes
    app.post("/posts/:postId/likes", {
        schema: {
            tags: ["Likes"],
            summary: "Curtir post",
            params: postIdParam,
            body: {
                type: "object",
                required: ["userId"],
                properties: { userId: { type: "string", format: "uuid" } },
            },
            response: { 201: likeSchema },
        },
    }, likeController.likePost.bind(likeController));

    app.delete("/posts/:postId/likes", {
        schema: {
            tags: ["Likes"],
            summary: "Descurtir post",
            params: postIdParam,
            body: {
                type: "object",
                required: ["userId"],
                properties: { userId: { type: "string", format: "uuid" } },
            },
            response: { 204: { type: "null", description: "Descurtido com sucesso" } },
        },
    }, likeController.unlikePost.bind(likeController));

    app.get("/users/:userId/likes", {
        schema: {
            tags: ["Likes"],
            summary: "Listar curtidas de um usuário",
            params: userIdParam,
            response: { 200: { type: "array", items: likeSchema } },
        },
    }, likeController.findLikesByUser.bind(likeController));

    app.get("/posts/:postId/likes", {
        schema: {
            tags: ["Likes"],
            summary: "Listar curtidas de um post",
            params: postIdParam,
            response: { 200: { type: "array", items: likeSchema } },
        },
    }, likeController.findLikesByPost.bind(likeController));

    //rota de comentários
    app.post("/comments", {
        schema: {
            tags: ["Comments"],
            summary: "Criar comentário",
            body: {
                type: "object",
                required: ["postId", "userId", "content"],
                properties: {
                    postId: { type: "string", format: "uuid" },
                    userId: { type: "string", format: "uuid" },
                    content: { type: "string", minLength: 1 },
                },
            },
            response: { 201: commentSchema },
        },
    }, commentController.create.bind(commentController));

    app.get("/posts/:postId/comments", {
        schema: {
            tags: ["Comments"],
            summary: "Listar comentários de um post",
            params: postIdParam,
            response: { 200: { type: "array", items: commentSchema } },
        },
    }, commentController.findByPost.bind(commentController));

    app.get("/users/:userId/comments", {
        schema: {
            tags: ["Comments"],
            summary: "Listar comentários de um usuário",
            params: userIdParam,
            response: { 200: { type: "array", items: commentSchema } },
        },
    }, commentController.findByUser.bind(commentController));

    app.patch("/comments/:commentId", {
        schema: {
            tags: ["Comments"],
            summary: "Atualizar comentário",
            params: {
                type: "object",
                required: ["commentId"],
                properties: { commentId: { type: "string", format: "uuid" } },
            },
            body: {
                type: "object",
                required: ["userId", "content"],
                properties: {
                    userId: { type: "string", format: "uuid" },
                    content: { type: "string" },
                },
            },
            response: { 200: commentSchema },
        },
    }, commentController.update.bind(commentController));

    app.delete("/comments/:commentId", {
        schema: {
            tags: ["Comments"],
            summary: "Remover comentário (soft delete)",
            params: {
                type: "object",
                required: ["commentId"],
                properties: { commentId: { type: "string", format: "uuid" } },
            },
            body: {
                type: "object",
                required: ["userId"],
                properties: { userId: { type: "string", format: "uuid" } },
            },
            response: { 204: { type: "null", description: "Removido com sucesso" } },
        },
    }, commentController.softDelete.bind(commentController));
}
