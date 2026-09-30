import mongoose from "mongoose";
import { logger } from "./logger.js";

mongoose.set("strictQuery", true);

export async function connectDatabase(uri) {
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB bağlantısı koptu"));
  mongoose.connection.on("reconnected", () => logger.info("MongoDB yeniden bağlandı"));
  mongoose.connection.on("error", (error) => logger.error({ err: error }, "MongoDB hatası"));

  const startedAt = Date.now();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  logger.info(
    { db: mongoose.connection.name, durationMs: Date.now() - startedAt },
    "MongoDB bağlantısı kuruldu",
  );
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
