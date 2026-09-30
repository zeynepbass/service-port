"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { listRequests } from "../api/request.api";

export function useRequestList(filters) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.requests(filters),
    queryFn: ({ pageParam }) => listRequests({ ...filters, cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.nextCursor ?? undefined,
  });

  return {
    requests: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useMyRequests(status) {
  return useRequestList({ scope: "mine", status, limit: 12 });
}
