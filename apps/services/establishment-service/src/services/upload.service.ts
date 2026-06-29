import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { r2Client } from "../config/r2";
import { env } from "../config/env";
import prismaClient from "../prisma/index";

export class UploadService {
  static async uploadProfilePicture(
    establishmentId: string,
    fileStream: Readable,
    mimeType: string
  ): Promise<string> {
    const key = `establishments/${establishmentId}/profile/${randomUUID()}`;

    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: env.r2_bucket_name,
        Key: key,
        Body: fileStream,
        ContentType: mimeType,
      },
    });

    await upload.done();

    const publicUrl = `${env.r2_public_url}/${key}`;

    await prismaClient.establishment.update({
      where: { id: establishmentId },
      data: { photoUrl: publicUrl },
    });

    return publicUrl;
  }
}
