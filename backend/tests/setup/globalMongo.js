import { MongoMemoryServer } from "mongodb-memory-server";

let server;

export async function setup({ provide }) {
  if (process.env.TEST_MONGO_URI) {
    provide("mongoUri", process.env.TEST_MONGO_URI);
    return;
  }
  server = await MongoMemoryServer.create();
  provide("mongoUri", server.getUri());
}

export async function teardown() {
  await server?.stop();
}
