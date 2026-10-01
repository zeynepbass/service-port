import { HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import CategoryRequestsPage from "@/features/request/pages/CategoryRequestsPage";
import { prefetchState } from "@/shared/api/prefetch";
import { queryKeys } from "@/shared/api/queryKeys";
import { serverGet } from "@/shared/api/server";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await serverGet(`/categories/${encodeURIComponent(slug)}`);
  return {
    title: data?.name ?? "Kategori",
    description: data?.description ?? undefined,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const { state, results } = await prefetchState([
    [queryKeys.category(slug), `/categories/${encodeURIComponent(slug)}`],
  ]);
  if (results[0].notFound) notFound();

  return (
    <HydrationBoundary state={state}>
      <CategoryRequestsPage slug={slug} />
    </HydrationBoundary>
  );
}
