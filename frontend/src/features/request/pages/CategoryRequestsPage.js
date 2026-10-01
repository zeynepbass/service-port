"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCategory } from "@/features/category/api/category.api";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button } from "@/shared/components/atoms";
import { EmptyState } from "@/shared/components/molecules";
import { CategoryRequestCard } from "../components/CategoryRequestCard";
import { useCategoryRequests } from "../hooks/useCategoryRequests";

function RequestGridSkeleton() {
  return (
    <div
      className="mt-8 grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {["a", "b", "c"].map((key) => (
        <div key={key} className="h-64 rounded-2xl border border-gray-200 bg-white" />
      ))}
    </div>
  );
}

export default function CategoryRequestsPage({ slug }) {
  const router = useRouter();
  const { data: category } = useQuery({
    queryKey: queryKeys.category(slug),
    queryFn: () => getCategory(slug),
  });
  const { requests, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useCategoryRequests(slug);

  function handleMessage(request) {
    router.push(`/mesaj-kutusu?alici=${request.owner.id}&talep=${request.id}`);
  }

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8">
          <span className="text-sm font-medium text-[#6B4F6D]">Hizmetler</span>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl tracking-tight text-gray-800 sm:text-3xl">{category?.name ?? ""}</h1>
              <p className="mt-2 text-sm text-gray-500">Bu kategoride hizmet arayan kullanıcıları keşfet.</p>
            </div>
            {requests.length > 0 && (
              <span className="rounded-full bg-[#EDE7F1] px-3 py-1.5 text-xs font-medium text-[#6B4F6D]">
                {requests.length} talep
              </span>
            )}
          </div>
        </header>

        {isLoading ? (
          <RequestGridSkeleton />
        ) : requests.length > 0 ? (
          <section aria-label="Talepler" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <CategoryRequestCard key={request.id} request={request} onMessage={handleMessage} />
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-gray-200 bg-white">
            <EmptyState
              title="Henüz talep bulunamadı"
              description="Bu kategoriye ait henüz yayınlanmış bir hizmet talebi bulunmuyor."
            />
          </section>
        )}

        {hasNextPage && (
          <div className="mt-6 flex justify-center">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="ghost">
              {isFetchingNextPage ? "Yükleniyor..." : "Daha fazla göster"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
