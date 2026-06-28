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
import { z } from "zod";

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = 20;

export class PostController {

    constructor(private readonly postService: PostService) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const fields: Record<string, string> = {};
        const imageFiles: Array<{ buffer: Buffer; mimetype: string }> = [];

        for await (const part of request.parts()) {
            if (part.type === 'field') {
                fields[part.fieldname] = part.value as string;
            } else if (part.type === 'file' && part.fieldname === 'images') {
                if (!ALLOWED_TYPES.includes(part.mimetype)) {
                    // drena a stream antes de rejeitar, senão o multipart trava
                    await part.toBuffer();
                    return reply.status(400).send({
                        message: `Formato inválido: ${part.filename}. Use JPEG, PNG ou WebP.`
                    });
                }

                if (imageFiles.length >= MAX_FILES) {
                    await part.toBuffer();
                    return reply.status(400).send({
                        message: `Máximo de ${MAX_FILES} imagens por post.`
                    });
                }

                const buffer = await part.toBuffer();
                imageFiles.push({ buffer, mimetype: part.mimetype });
            }
        }

        if (imageFiles.length === 0) {
            return reply.status(400).send({ message: 'Pelo menos uma imagem é obrigatória.' });
        }

        const parsed = createPostSchema.safeParse(fields);
        if (!parsed.success) {
            return reply.status(400).send({
                message: 'Dados inválidos.',
                errors: parsed.error.flatten().fieldErrors
            });
        }

        const data: CreatePostInput = {
            ...parsed.data,
            imageFiles, // passa os buffers pro service processar
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