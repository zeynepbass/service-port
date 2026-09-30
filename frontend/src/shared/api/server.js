import { cookies } from "next/headers";
import { getServerEnv } from "@/shared/config/env";

export async function serverGet(path) {
  const cookieStore = await cookies();
  const { apiInternalUrl } = getServerEnv();

  try {
    const response = await fetch(`${apiInternalUrl}/api${path}`, {
      headers: { cookie: cookieStore.toString(), accept: "application/json" },
      cache: "no-store",
    });

    if (response.status === 404) return { notFound: true };
    if (!response.ok) return { data: null };

    const body = await response.json();
    return { data: body.data, meta: body.meta };
  } catch {
    return { data: null };
  }
}

export async function prefetchInto(queryClient, queryKey, path) {
  const result = await serverGet(path);
  if (result.data) {
    queryClient.setQueryData(queryKey, result.data);
  }
  return result;
}
