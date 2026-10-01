import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
  });
}

function wrapperFor(queryClient) {
  return function Wrapper({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

export function renderWithClient(ui, queryClient = createTestQueryClient()) {
  return { queryClient, ...render(ui, { wrapper: wrapperFor(queryClient) }) };
}

export function renderHookWithClient(hook, queryClient = createTestQueryClient()) {
  return { queryClient, ...renderHook(hook, { wrapper: wrapperFor(queryClient) }) };
}
