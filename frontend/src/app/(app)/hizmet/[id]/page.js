import { HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import RequestDetailPage from "@/features/request/pages/RequestDetailPage";
import { prefetchState } from "@/shared/api/prefetch";
import { queryKeys } from "@/shared/api/queryKeys";

export const metadata = { title: "Talep detayı", robots: { index: false } };

export default async function Page({ params }) {
  const { id } = await params;
  const { state, results } = await prefetchState([
    [queryKeys.request(id), `/requests/${encodeURIComponent(id)}`],
  ]);
  if (results[0].notFound) notFound();

  return (
    <HydrationBoundary state={state}>
      <RequestDetailPage id={id} />
    </HydrationBoundary>
  );
}
