import pino from "pino";
import { env } from "./env.js";

const usePretty = env.NODE_ENV === "development";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "res.headers['set-cookie']",
      "*.password",
      "*.passwordHash",
      "*.token",
    ],
    censor: "[redacted]",
  },
  ...(usePretty && {
    transport: { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss" } },
  }),
});
