import { Location } from "@/shared/components/organisms";
import { formatDateRange } from "@/shared/utils/format";
import { StatusBadge } from "../StatusBadge";

export function RequestDetails({ request }) {
  return (
    <section aria-labelledby="request-details-title" className="mt-8">
      <h2 id="request-details-title" className="mb-6 text-2xl tracking-tight text-[#222C31]">
        Detaylar
      </h2>

      <div className="m-3 overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm">
        <div className="border-b border-gray-100 px-5 py-5 md:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
            Hizmet Kategorisi
          </span>
          <p className="mt-2 text-base text-[#222C31]">{request.title}</p>
        </div>

        <dl className="grid grid-cols-1 gap-5 px-5 py-5 md:grid-cols-2 md:px-6">
          <div className="rounded-xl bg-[#FCFBFD] p-4">
            <dt className="text-xs font-medium text-gray-500">Durum</dt>
            <dd className="mt-1">
              <StatusBadge status={request.status} isExpired={request.isExpired} />
            </dd>
          </div>
          <div className="rounded-xl bg-[#FCFBFD] p-4">
            <dt className="text-xs font-medium text-gray-500">İlan Tarihi</dt>
            <dd className="mt-1 text-sm text-[#222C31]">
              {formatDateRange(request.startsAt, request.endsAt)}
            </dd>
          </div>
          {request.contact && (
            <div className="rounded-xl bg-[#FCFBFD] p-4 md:col-span-2">
              <dt className="text-xs font-medium text-gray-500">İletişim</dt>
              <dd className="mt-1 text-sm text-[#222C31]">
                {request.contact.phone || "Telefon belirtilmemiş"} · {request.contact.email}
              </dd>
            </div>
          )}
        </dl>

        {request.location && (
          <div className="border-t border-gray-100 px-5 py-5 md:px-6">
            <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
              Konum
            </span>
            <div className="rounded-xl border border-gray-100 bg-[#FCFBFD] p-4">
              <Location location={request.location} label={`${request.title} talebinin konumu`} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
