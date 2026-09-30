import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.",
    },
  },
});
