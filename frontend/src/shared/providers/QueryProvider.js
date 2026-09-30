"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setSessionExpiredHandler } from "@/shared/api/client";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30 * 1000 },
    },
  });
}

export function QueryProvider({ children }) {
  const [queryClient] = useState(createQueryClient);
  const router = useRouter();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.clear();
      router.replace("/giris-yap");
    });
  }, [queryClient, router]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
