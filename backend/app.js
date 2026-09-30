import crypto from "node:crypto";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { corsOptions } from "./config/cors.js";
import { isDatabaseReady } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { buildOpenApiDocument } from "./docs/openapi.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { uploadDirectory } from "./middleware/upload.js";
import apiRoutes from "./routes/index.js";

const REQUEST_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

export function createApp() {
  const app = express();

  app.set("trust proxy", env.TRUST_PROXY ? 1 : false);

  app.use(
    pinoHttp({
      logger,
      genReqId(req, res) {
        const incoming = req.headers["x-request-id"];
        const id =
          typeof incoming === "string" && REQUEST_ID_PATTERN.test(incoming) ? incoming : crypto.randomUUID();
        res.setHeader("X-Request-Id", id);
        return id;
      },
      autoLogging: { ignore: (req) => req.url === "/health" },
    }),
  );

  app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));
  app.use(cookieParser());
  app.use(mongoSanitize());

  app.use("/uploads", express.static(uploadDirectory, { maxAge: "7d", index: false }));

  app.get("/health", (req, res) => {
    const database = isDatabaseReady() ? "up" : "down";
    res.status(database === "up" ? 200 : 503).json({
      status: database === "up" ? "ok" : "degraded",
      database,
      uptime: Math.round(process.uptime()),
    });
  });

  const openApiDocument = buildOpenApiDocument();
  app.get("/api/openapi.json", (req, res) => res.json(openApiDocument));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/api", apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
