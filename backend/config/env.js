import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const booleanString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(6398),
    MONGO_URI: z.string({ error: "MONGO_URI zorunludur" }).min(1, "MONGO_URI zorunludur"),
    JWT_ACCESS_SECRET: z.string({ error: "JWT_ACCESS_SECRET zorunludur" }).min(32, "JWT_ACCESS_SECRET en az 32 karakter olmalıdır"),
    ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
    PASSWORD_RESET_TTL_MINUTES: z.coerce.number().int().positive().default(30),
    CLIENT_URL: z.url({ error: "CLIENT_URL geçerli bir adres olmalıdır" }),
    CORS_ORIGINS: z.string().optional(),
    COOKIE_DOMAIN: z.string().optional(),
    COOKIE_SECURE: booleanString.optional(),
    COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().int().positive().default(1025),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().default("Hizmet Kap <no-reply@hizmetkap.local>"),
    UPLOAD_DIR: z.string().default("uploads"),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
    TRUST_PROXY: booleanString.default(false),
  })
  .transform((env) => ({
    ...env,
    CORS_ORIGINS: (env.CORS_ORIGINS ?? env.CLIENT_URL)
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    COOKIE_SECURE: env.COOKIE_SECURE ?? env.NODE_ENV === "production",
  }));

export function parseEnv(source) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Geçersiz ortam değişkenleri:\n${details}`);
  }

  return result.data;
}

export const env = parseEnv(process.env);
