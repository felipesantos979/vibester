import { r2Client } from "../config/r2";
import { env } from "../config/env";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PresignedUrlItem } from "../types/post.types";

const PRESIGN_CONCURRENCY = 5;

export class UploadService {
    async uploadImages(files: Array<{ buffer: Buffer; mimetype: string }>, userId: string,
        postId: string,): Promise<string[]> {
        return this.runWithConcurrency(
            files.map((file) => () => this.processAndUpload(file, userId, postId)),
            PRESIGN_CONCURRENCY
        );
    }

    async generatePresignedUrls(userId: string, count: number): Promise<PresignedUrlItem[]> {
        const tasks = Array.from({ length: count }, () => () => this.generateOnePresignedUrl(userId));
        return this.runWithConcurrency(tasks, PRESIGN_CONCURRENCY);
    }

    private async generateOnePresignedUrl(userId: string): Promise<PresignedUrlItem> {
        const key = `posts/${userId}/${randomUUID()}`;
        const command = new PutObjectCommand({
            Bucket: env.r2_bucket_name,
            Key: key,
        });
        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
        const publicUrl = `${env.r2_public_url}/${key}`;
        return { uploadUrl, key, publicUrl };
    }

    private async processAndUpload(
        { buffer, mimetype }: { buffer: Buffer; mimetype: string },
        userId: string,
        postId: string,
    ): Promise<string> {
        const key = `posts/${userId}/${postId}/${randomUUID()}.webp`;

        await r2Client.send(new PutObjectCommand({
            Bucket: env.r2_bucket_name,
            Key: key,
            Body: sharp(buffer)
                .resize({ width: 1080, withoutEnlargement: true })
                .webp({ quality: 80 }),
            ContentType: "image/webp",
        }));

        return `${env.r2_public_url}/${key}`;
    }

    private async runWithConcurrency<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
        const results: T[] = [];
        for (let i = 0; i < tasks.length; i += concurrency) {
            const batch = tasks.slice(i, i + concurrency).map((t) => t());
            results.push(...await Promise.all(batch));
        }
        return results;
    }
}
