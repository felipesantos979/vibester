import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing required env var: ${key}`);
    return val;
}

export const env = {
    port: Number(process.env.PORT ?? 3334),
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    databaseUrl: required("DATABASE_URL"),
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "https://vibester.com.br").split(","),
};
