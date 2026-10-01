import { HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import CreateRequestPage from "@/features/request/pages/CreateRequestPage";
import { prefetchState } from "@/shared/api/prefetch";
import { queryKeys } from "@/shared/api/queryKeys";

export const metadata = { title: "Talep oluştur" };

export default async function Page({ params }) {
  const { slug } = await params;
  const { state, results } = await prefetchState([
    [queryKeys.template(slug), `/categories/${encodeURIComponent(slug)}/template`],
  ]);
  if (results[0].notFound) notFound();

  return (
    <HydrationBoundary state={state}>
      <CreateRequestPage slug={slug} />
    </HydrationBoundary>
  );
}
