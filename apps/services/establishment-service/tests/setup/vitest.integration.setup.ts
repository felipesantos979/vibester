// Sets env vars with safe defaults before any module is imported.
// CI overrides these via job-level environment variables.
process.env.PORT ??= "3002";
process.env.NODE_ENV ??= "test";
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/establishment_test";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.JWT_SECRET ??= "integration-test-secret-key-32chars";
process.env.CORS_ORIGIN ??= "";
process.env.SWAGGER_ENABLED ??= "false";
process.env.SERP_API_KEY ??= "test-serp-key";
process.env.r2_account_id ??= "test-account";
process.env.r2_access_key_id ??= "test-key-id";
process.env.r2_secret_access_key ??= "test-r2-secret";
process.env.r2_bucket_name ??= "test-bucket";
process.env.r2_public_url ??= "https://test.r2.dev";
