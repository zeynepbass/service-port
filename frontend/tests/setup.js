import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw";

vi.mock("next/navigation", () => {
  const router = { push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn() };
  return {
    useRouter: () => router,
    usePathname: () => "/ana-sayfa",
    useSearchParams: () => new URLSearchParams(),
  };
});

vi.mock("next/image", () => ({
  default: ({ src, alt, fill: _fill, priority: _priority, ...props }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.clearAllMocks();
});
afterAll(() => server.close());
