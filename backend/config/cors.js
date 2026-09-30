import { env } from "./env.js";

export function isAllowedOrigin(origin) {
  return !origin || env.CORS_ORIGINS.includes(origin);
}

export const corsOptions = {
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
};
