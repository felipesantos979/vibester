import { FastifyReply, FastifyRequest } from "fastify";
import { CommentService } from "../services/comment.service";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment.type";

export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    async create(
        request: FastifyRequest<{
            Body: CreateCommentInput;
        }>,
        reply: FastifyReply
    ) {
        const comment = await this.commentService.create(request.body);

        return reply.status(201).send(comment);
    }

    async findByPost(
        request: FastifyRequest<{
            Params: { postId: string };
        }>,
        reply: FastifyReply
    ) {
        const comments = await this.commentService.findByPost(request.params.postId);

        return reply.status(200).send(comments);
    }

    async findByUser(
        request: FastifyRequest<{
            Params: { userId: string };
        }>,
        reply: FastifyReply
    ) {
        const comments = await this.commentService.findByUser(request.params.userId);

        return reply.status(200).send(comments);
    }

    async update(
        request: FastifyRequest<{
            Params: { commentId: string };
            Body: { userId: string; content: string };
        }>,
        reply: FastifyReply
    ) {
        const comment = await this.commentService.update(
            {
                commentId: request.params.commentId,
                content: request.body.content
            },
            request.body.userId
        );

        return reply.status(200).send(comment);
    }

    async softDelete(
        request: FastifyRequest<{
            Params: { commentId: string };
            Body: { userId: string };
        }>,
        reply: FastifyReply
    ) {
        await this.commentService.softDelete(request.params.commentId, request.body.userId);

        return reply.status(204).send();
    }
}