"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getSession } from "../api/auth.api";

export function useSession() {
  const query = useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60 * 1000,
  });

  return { user: query.data ?? null, isLoading: query.isLoading, isError: query.isError };
}
