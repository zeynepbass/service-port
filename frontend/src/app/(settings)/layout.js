import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchState, sessionEntry } from "@/shared/api/prefetch";
import { SettingsShell } from "@/shared/layouts";
import { QueryProvider } from "@/shared/providers/QueryProvider";

export default async function SettingsLayout({ children }) {
  const { state } = await prefetchState([sessionEntry()]);

  return (
    <QueryProvider>
      <HydrationBoundary state={state}>
        <SettingsShell>
          <div id="main-content">{children}</div>
        </SettingsShell>
      </HydrationBoundary>
    </QueryProvider>
  );
}
