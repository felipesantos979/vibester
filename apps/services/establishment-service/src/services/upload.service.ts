import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { r2Client } from "../config/r2";
import { env } from "../config/env";
import prismaClient from "../prisma/index";

export class UploadService {
    static async uploadProfilePicture(
        establishmentId: string,
        fileBuffer: Buffer,
        mimeType: string
    ): Promise<string> {
        const key = `establishments/${establishmentId}/profile/${randomUUID()}`;

        await r2Client.send(new PutObjectCommand({
            Bucket: env.r2_bucket_name!,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
        }));

        const publicUrl = `${env.r2_public_url}/${key}`;

        await prismaClient.establishment.update({
            where: { id: establishmentId },
            data: { photoUrl: publicUrl },
        });

        return publicUrl;
    }
}