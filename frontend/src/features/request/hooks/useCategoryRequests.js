"use client";

import { useRequestList } from "./useMyRequests";

export function useCategoryRequests(slug) {
  return useRequestList({ scope: "others", category: slug, status: "active", limit: 12 });
}
