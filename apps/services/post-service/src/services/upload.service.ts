import { r2Client } from "../config/r2";
import { env } from "../config/env";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PresignedUrlItem } from "../types/post.types";

export class UploadService {
    async uploadImages(files: Array<{ buffer: Buffer; mimetype: string }>, userId: string,
        postId: string,): Promise<string[]> {
        return Promise.all(files.map((file) => this.processAndUpload(file, userId, postId)));
    }

    async generatePresignedUrls(userId: string, count: number): Promise<PresignedUrlItem[]> {
        return Promise.all(
            Array.from({ length: count }, async () => {
                const key = `posts/${userId}/${randomUUID()}`;
                const command = new PutObjectCommand({
                    Bucket: env.r2_bucket_name!,
                    Key: key,
                });
                const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
                const publicUrl = `${env.r2_public_url}/${key}`;
                return { uploadUrl, key, publicUrl };
            })
        );
    }

    private async processAndUpload({
        buffer,
        mimetype
    }:
        {
            buffer: Buffer;
            mimetype: string
        },
        userId: string,
        postId: string,): Promise<string> {
        const processed = await sharp(buffer)
            .resize({ width: 1080, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const key = `posts/${userId}/${postId}/${randomUUID()}.webp`;

        await r2Client.send(new PutObjectCommand({
            Bucket: env.r2_bucket_name!,
            Key: key,
            Body: processed,
            ContentType: "image/webp",
        }));

        return `${env.r2_public_url}/${key}`;
    }
}