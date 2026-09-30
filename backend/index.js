import http from "node:http";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { createSocketServer } from "./sockets/index.js";

const SHUTDOWN_TIMEOUT_MS = 10000;

async function start() {
  await connectDatabase(env.MONGO_URI);

  const app = createApp();
  const server = http.createServer(app);
  const io = createSocketServer(server);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "Sunucu çalışıyor");
  });

  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "Sunucu kapatılıyor");

    const forceExit = setTimeout(() => {
      logger.error("Kapanış zaman aşımına uğradı");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    io.close(async () => {
      await disconnectDatabase();
      logger.info("Sunucu kapandı");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Yakalanmamış promise reddi");
});

start().catch((error) => {
  logger.fatal({ err: error }, "Sunucu başlatılamadı");
  process.exit(1);
});
