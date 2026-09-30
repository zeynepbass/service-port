"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryKeys } from "@/shared/api/queryKeys";
import { listMessages } from "../api/message.api";

export function useMessages(conversationId) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: ({ pageParam }) => listMessages(conversationId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.nextCursor ?? undefined,
    enabled: Boolean(conversationId),
  });

  const messages = useMemo(
    () => (query.data?.pages.flatMap((page) => page.items) ?? []).slice().reverse(),
    [query.data],
  );

  return {
    messages,
    isLoading: query.isLoading,
    hasOlder: query.hasNextPage,
    loadOlder: query.fetchNextPage,
    isLoadingOlder: query.isFetchingNextPage,
  };
}
