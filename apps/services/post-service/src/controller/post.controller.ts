import { FastifyReply, FastifyRequest } from "fastify";
import {
    postIdParamsSchema,
    userIdParamsSchema,
    establishmentIdParamsSchema,
    updatePostSchema,
    generateUploadUrlsSchema,
} from "../schema/post.schema";
import { PostService } from "../services/post.service";
import { UploadService } from "../services/upload.service";
import { CreatePostInput, UpdatePostInput } from "../types/post.types";

export class PostController {

    constructor(
        private readonly postService: PostService,
        private readonly uploadService: UploadService,
    ) {}

    async create(
        request: FastifyRequest<{
            Body: {
                userId: string;
                userUsername?: string;
                userProfilePicture?: string;
                userVerified?: boolean;
                imageUrls: string[];
                caption?: string;
                tags?: string[];
                establishmentId?: string;
                establishmentName?: string;
                establishmentLogo?: string;
                establishmentCategory?: string;
            };
        }>,
        reply: FastifyReply
    ) {
        const {
            userId, imageUrls, caption, establishmentId,
            userUsername, userProfilePicture, userVerified,
            establishmentName, establishmentLogo, establishmentCategory, tags,
        } = request.body;

        const data: CreatePostInput = {
            userId,
            userUsername,
            userProfilePicture,
            userVerified,
            imageUrls,
            caption: caption ?? '',
            establishmentId,
            establishmentName,
            establishmentLogo,
            establishmentCategory,
            tags,
        };

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
            return reply.status(404).send({ message: "Post not found" });
        }

        return reply.status(200).send(post);
    }

    async findByUser(
        request: FastifyRequest<{
            Params: { userId: string; };
            Querystring: { limit?: number; cursor?: string };
        }>,
        reply: FastifyReply
    ) {
        const { userId } = userIdParamsSchema.parse(request.params);
        const limit = request.query.limit ?? 50;
        const result = await this.postService.findByUser(userId, limit, request.query.cursor);

        if (result.nextCursor) { reply.header("X-Next-Cursor", result.nextCursor); }
        return reply.status(200).send(result.posts);
    }

    async findByEstablishment(
        request: FastifyRequest<{
            Params: { establishmentId: string; };
            Querystring: { limit?: number; cursor?: string };
        }>,
        reply: FastifyReply
    ) {
        const { establishmentId } = establishmentIdParamsSchema.parse(request.params);
        const limit = request.query.limit ?? 50;
        const result = await this.postService.findByEstablishment(establishmentId, limit, request.query.cursor);

        if (result.nextCursor) { reply.header("X-Next-Cursor", result.nextCursor); }
        return reply.status(200).send(result.posts);
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

        const updateInput: UpdatePostInput = { postId, caption };

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

    async generateUploadUrls(
        request: FastifyRequest<{
            Body: { userId: string; count: number };
        }>,
        reply: FastifyReply
    ) {
        const { userId, count } = generateUploadUrlsSchema.parse(request.body);
        const urls = await this.uploadService.generatePresignedUrls(userId, count);

        return reply.status(200).send(urls);
    }
}
