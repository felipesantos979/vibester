import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  databaseUrl: process.env.DATABASE_URL as string,
  dbPoolMax: process.env.DB_POOL_MAX,
  serpapiKey: process.env.SERP_API_KEY as string,
  googleKey: process.env.GOOGLE_API_KEY as string,
  establishmentServiceUrl: process.env.ESTABLISHMENT_SERVICE_URL as string,
  timezone: process.env.TZ as string,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  rateLimitTimeWindow: process.env.RATE_LIMIT_TIME_WINDOW || "1 minute",
};
