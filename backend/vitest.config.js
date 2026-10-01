import { defineConfig } from "vitest/config";

const ANY_DEPTH = "**";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup/env.js"],
    globalSetup: ["./tests/setup/globalMongo.js"],
    hookTimeout: 60000,
    testTimeout: 20000,
    fileParallelism: false,
    coverage: {
      provider: "v8",
      include: ["services", "utils", "middleware", "controllers", "sockets"].map(
        (dir) => `${dir}/${ANY_DEPTH}`,
      ),
      thresholds: { [`services/${ANY_DEPTH}`]: { lines: 80, functions: 80, statements: 80, branches: 70 } },
    },
  },
});
