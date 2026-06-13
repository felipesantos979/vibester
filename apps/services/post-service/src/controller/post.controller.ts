import { FastifyReply, FastifyRequest } from "fastify";
import {
    createPostSchema,
    postIdParamsSchema,
    userIdParamsSchema,
    establishmentIdParamsSchema,
    updatePostSchema
} from "../schema/post.schema";
import { PostService } from "../services/post.service";
import { CreatePostInput, UpdatePostInput } from "../types/post.types";

export class PostController {

    constructor(private readonly postService: PostService) { }

    async create(
        request: FastifyRequest<{ Body: CreatePostInput }>,
        reply: FastifyReply
    ) {
        const data = createPostSchema.parse(request.body) as CreatePostInput;

        const post = await this.postService.create(data);

        return reply.status(201).send(post);
    }

    async findById(
        request: FastifyRequest<{
            Params: { postId: string; };
        }>,
        reply: FastifyReply
    ) {
        const { postId } = postIdParamsSchema.parse(request.params);
        const post = await this.postService.findById(postId);

        if (!post) {
            return reply.status(404).send({
                message: "Post not found"
            });
        }

        return reply.status(200).send(post);
    }

    async findByUser(
        request: FastifyRequest<{
            Params: { userId: string; };
        }>,
        reply: FastifyReply
    ) {
        const { userId } = userIdParamsSchema.parse(request.params);
        const posts = await this.postService.findByUser(userId);

        return reply.status(200).send(posts);
    }

    async findByEstablishment(
        request: FastifyRequest<{
            Params: { establishmentId: string; };
        }>,
        reply: FastifyReply
    ) {
        const { establishmentId } = establishmentIdParamsSchema.parse(request.params);
        const posts = await this.postService.findByEstablishment(establishmentId);

        return reply.status(200).send(posts);
    }

    async updateCaption(
        request: FastifyRequest<{
            Params: { postId: string };
            Body: { caption: string };
        }>,
        reply: FastifyReply
    ) {
        const { postId } = postIdParamsSchema.parse(request.params);
        const { caption } = updatePostSchema.parse(request.body);

        const updateInput: UpdatePostInput = {
            postId: postId,
            caption: caption
        };

        const post = await this.postService.updateCaption(updateInput);

        return reply.status(200).send(post);
    }

    async softDelete(
        request: FastifyRequest<{
            Params: { postId: string; };
        }>,
        reply: FastifyReply
    ) {
        const { postId } = postIdParamsSchema.parse(request.params);
        await this.postService.softDelete(postId);

        return reply.status(204).send();
    }
}