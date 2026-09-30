import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export async function runScript(name, task) {
  try {
    await connectDatabase(env.MONGO_URI);
    const result = await task();
    logger.info({ result }, `${name} tamamlandı`);
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.fatal({ err: error }, `${name} başarısız oldu`);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
}

export function isDirectRun(importMetaUrl) {
  return process.argv[1] && new URL(`file://${process.argv[1]}`).pathname === new URL(importMetaUrl).pathname;
}
