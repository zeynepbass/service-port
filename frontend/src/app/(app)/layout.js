import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchState, sessionEntry } from "@/shared/api/prefetch";
import { queryKeys } from "@/shared/api/queryKeys";
import { AppShell } from "@/shared/layouts";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { SocketProvider } from "@/shared/providers/SocketProvider";

export default async function AppLayout({ children }) {
  const { state } = await prefetchState([sessionEntry(), [queryKeys.categories, "/categories"]]);

  return (
    <QueryProvider>
      <HydrationBoundary state={state}>
        <SocketProvider>
          <AppShell>{children}</AppShell>
        </SocketProvider>
      </HydrationBoundary>
    </QueryProvider>
  );
}
