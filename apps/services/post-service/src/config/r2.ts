import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${env.r2_account_id}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.r2_access_key_id,
        secretAccessKey: env.r2_secret_access_key,
    },
    maxAttempts: 3,
});
