import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const ANY_DEPTH = "**";

export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: "jsx", include: /src\/.*\.js$|tests\/.*\.js$/, exclude: [] },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["src", "tests"].map((root) => [root, ANY_DEPTH, "*.test.js"].join("/")),
    env: {
      NEXT_PUBLIC_API_URL: "http://api.test",
      NEXT_PUBLIC_SOCKET_URL: "http://api.test",
    },
    css: false,
  },
});
