import { randomUUID } from "crypto";
import { PostRepository } from "../repository/post.repository";
import {
    CreatePostInput,
    Post,
    UpdatePostInput
} from "../types/post.types";
import { UploadService } from "./upload.service";

export class PostService {

    constructor(
        private readonly postRepository: PostRepository,
        private readonly uploadService: UploadService,
    ) {}

    async create(input: CreatePostInput): Promise<Post> {
        const postId = randomUUID();

        const imageUrls = await this.uploadService.uploadImages(input.imageFiles, input.userId, postId);

        const post: Post = {
            postId,
            userId: input.userId,
            userUsername: input.userUsername,
            userProfilePicture: input.userProfilePicture,
            userVerified: input.userVerified,
            establishmentId: input.establishmentId,
            establishmentName: input.establishmentName,
            establishmentLogo: input.establishmentLogo,
            establishmentCategory: input.establishmentCategory,
            imageUrls,
            caption: input.caption,
            tags: input.tags,
            totalLikes: 0,
            totalComments: 0,
            isDeleted: false,
            createdAt: new Date(),
        };

        await Promise.all([
            this.postRepository.createPostById(post),
            this.postRepository.createPostByUser(post),
        ]);

        if (post.establishmentId) {
            await this.postRepository.createPostByEstablishment(post);
        }

        return post;
    }

    async findById(postId: string) {
        return this.postRepository.findById(postId);
    }

    async findByUser(userId: string) {
        return this.postRepository.findByUser(userId);
    }

    async findByEstablishment(establishmentId: string) {
        return this.postRepository.findByEstablishment(establishmentId);
    }

    async updateCaption(input: UpdatePostInput): Promise<Post> {
        const post = await this.postRepository.findById(input.postId);

        if (!post) { throw new Error("Post not found"); }

        if (post.isDeleted) { throw new Error("Post is deleted"); }

        const updatedAt = new Date();

        await Promise.all([
            this.postRepository.updateCaptionById(input.postId, input.caption, updatedAt),
            this.postRepository.updateCaptionByUser(post.userId, post.createdAt, input.postId, input.caption, updatedAt),
        ]);

        if (post.establishmentId) {
            await this.postRepository.updateCaptionByEstablishment(post.establishmentId, post.createdAt, input.postId, input.caption, updatedAt);
        }

        return {
            ...post,
            caption: input.caption,
            updatedAt,
        };
    }

    async softDelete(postId: string) {
        const post = await this.postRepository.findById(postId);

        if (!post) { throw new Error("Post not found"); }

        await Promise.all([
            this.postRepository.softDeleteById(postId),
            this.postRepository.softDeleteByUser(post.userId, post.createdAt, postId),
        ]);

        if (post.establishmentId) {
            await this.postRepository.softDeleteByEstablishment(post.establishmentId, post.createdAt, post.postId);
        }
    }
}