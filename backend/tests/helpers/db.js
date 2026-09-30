import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll } from "vitest";

export function useTestDatabase() {
  beforeAll(async () => {
    const dbName = `test_${process.pid}_${Math.random().toString(36).slice(2, 8)}`;
    await mongoose.connect(process.env.MONGO_URI, { dbName });
    await mongoose.connection.syncIndexes();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((collection) => collection.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
}
