import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT || 3003,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    databaseUrl: process.env.DATABASE_URL as string,
    profileServiceUrl: process.env.PROFILE_SERVICE_URL as string,
    kafkaBrokers: process.env.KAFKA_BROKERS as string,
    rateLimitFollowMax: Number(process.env.RATE_LIMIT_FOLLOW_MAX) || 60,
};