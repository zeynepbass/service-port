import { Star } from "lucide-react";
import { Avatar, Button } from "@/shared/components/atoms";
import { Location } from "@/shared/components/organisms";
import { formatDateRange, fullName, initials } from "@/shared/utils/format";
import { RequestAnswers } from "../RequestAnswers";

export function CategoryRequestCard({ request, onMessage }) {
  const owner = request.owner;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[#DCD0E3] hover:shadow-md">
      <div className="border-b border-gray-100 px-5 py-5">
        <div className="mb-4 flex items-center gap-3">
          <Avatar src={owner?.avatar} name={fullName(owner)} fallback={initials(owner)} />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">Talep Sahibi</p>
            <p className="truncate text-sm text-[#222C31]">{fullName(owner)}</p>
            {owner?.ratingCount > 0 && (
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <Star size={12} aria-hidden="true" fill="currentColor" />
                {owner.ratingAverage} ({owner.ratingCount} değerlendirme)
              </p>
            )}
          </div>
        </div>

        {request.location && (
          <div>
            <p className="mb-1 text-xs text-gray-500">Konum</p>
            <Location location={request.location} label={`${request.title} talebinin konumu`} />
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500">İletişim bilgileri mesajlaştıktan sonra görünür.</p>
      </div>

      <div className="px-5 py-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">Kategori</p>
            <h3 className="mt-1 text-sm text-[#222C31]">{request.title}</h3>
          </div>
          <span className="rounded-full bg-[#EDE7F1] px-3 py-1 text-xs font-medium text-[#6B4F6D]">
            Hizmet
          </span>
        </div>

        <div className="mb-5 rounded-xl bg-[#FCFBFD] p-4">
          <p className="text-xs font-medium text-gray-500">İlan Tarihi</p>
          <p className="mt-1 text-sm text-[#222C31]">{formatDateRange(request.startsAt, request.endsAt)}</p>
        </div>

        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">Hizmet Detayları</p>
        <RequestAnswers answers={request.answers} compact />

        <div className="mt-6 border-t border-gray-100 pt-5">
          <Button onClick={() => onMessage(request)} variant="primary">
            Mesaj Gönder
          </Button>
        </div>
      </div>
    </article>
  );
}
