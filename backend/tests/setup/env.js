import { inject } from "vitest";

process.env.NODE_ENV = "test";
process.env.MONGO_URI = inject("mongoUri");
process.env.JWT_ACCESS_SECRET = "test-secret-that-is-long-enough-for-hs256-signing";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.UPLOAD_DIR = "tests/.uploads";
process.env.AUTH_RATE_LIMIT_MAX = "1000";
