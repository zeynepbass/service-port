import { QueryClient, dehydrate } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { prefetchInto } from "./server";

export async function prefetchState(entries) {
  const queryClient = new QueryClient();
  const results = await Promise.all(entries.map(([key, path]) => prefetchInto(queryClient, key, path)));
  return { state: dehydrate(queryClient), results };
}

export function sessionEntry() {
  return [queryKeys.session, "/users/me"];
}
