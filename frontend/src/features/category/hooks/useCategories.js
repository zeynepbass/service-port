"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getCategories } from "../api/category.api";

export function useCategories() {
  const query = useQuery({ queryKey: queryKeys.categories, queryFn: getCategories, staleTime: 10 * 60 * 1000 });
  return { categories: query.data ?? [], isLoading: query.isLoading };
}
