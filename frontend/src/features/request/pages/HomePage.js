"use client";

import { useState } from "react";
import { CategoryCarousel } from "@/features/category/components/CategoryCarousel";
import { Button } from "@/shared/components/atoms";
import { Loading } from "@/shared/components/molecules";
import { MyRequestCard } from "../components/MyRequestCard";
import { RequestEmptyState } from "../components/RequestEmptyState";
import { RequestTabs } from "../components/RequestTabs";
import { useChangeRequestStatus } from "../hooks/useChangeRequestStatus";
import { useMyRequests } from "../hooks/useMyRequests";
import { nextToggleStatus } from "../utils/status";

const TABS = [
  {
    key: "active",
    title: "Aktif işlerim",
    image: "/9315312.png",
    emptyText: "Aktif işin yok. Hemen kategorilerden, ihtiyacın olan hizmete kolayca ulaş.",
  },
  { key: "passive", title: "Pasif işlerim", image: null, emptyText: "Pasif işin yok." },
  { key: "cancelled", title: "İptal edilenler", image: null, emptyText: "İptal edilmiş işin yok." },
];

const PANEL_ID = "my-requests-panel";

export default function HomePage() {
  const [activeKey, setActiveKey] = useState("active");
  const { requests, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyRequests(activeKey);
  const { changeStatus, pendingId } = useChangeRequestStatus();
  const tab = TABS.find((item) => item.key === activeKey);

  return (
    <div className="flex min-h-screen flex-col">
      <h1 className="border-b border-gray-100 p-3 text-center text-4xl text-gray-500">İşlerim</h1>
      <RequestTabs tabs={TABS} activeKey={activeKey} onChange={setActiveKey} panelId={PANEL_ID} />

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`tab-${activeKey}`}>
        {isLoading ? (
          <Loading />
        ) : requests.length === 0 ? (
          <RequestEmptyState tab={tab} />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <MyRequestCard
                key={request.id}
                request={request}
                isUpdating={pendingId === request.id}
                onToggle={(item) => changeStatus(item.id, nextToggleStatus(item.status))}
              />
            ))}
          </div>
        )}
        {hasNextPage && (
          <div className="flex justify-center">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="ghost">
              {isFetchingNextPage ? "Yükleniyor..." : "Daha fazla göster"}
            </Button>
          </div>
        )}
      </div>

      <div id="trend-hizmetler" className="w-full pt-5">
        <CategoryCarousel />
      </div>
    </div>
  );
}
