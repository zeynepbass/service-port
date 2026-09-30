"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getRequest } from "../api/request.api";

export function useRequestDetail(id) {
  const query = useQuery({ queryKey: queryKeys.request(id), queryFn: () => getRequest(id), enabled: Boolean(id) });
  return { request: query.data ?? null, isLoading: query.isLoading, isError: query.isError };
}
