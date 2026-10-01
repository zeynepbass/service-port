import { ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { formatDateRange } from "@/shared/utils/format";
import { StatusBadge } from "../StatusBadge";

export function MyRequestCard({ request, onToggle, isUpdating }) {
  const isActive = request.status === "active";
  const canToggle = request.status !== "cancelled" && !request.isExpired;

  return (
    <article className="flex flex-col justify-between rounded-lg border border-gray-50 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg text-gray-600">
          <Link href={`/hizmet/${request.id}`} className="hover:underline">
            {request.title}
          </Link>
        </h3>
        {canToggle && (
          <button
            type="button"
            onClick={() => onToggle(request)}
            disabled={isUpdating}
            aria-pressed={isActive}
            aria-label={isActive ? "Talebi pasife al" : "Talebi aktifleştir"}
            className="text-[rgb(34,44,49)] disabled:opacity-50"
          >
            {isActive ? (
              <ToggleRight size={28} aria-hidden="true" />
            ) : (
              <ToggleLeft size={28} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {request.answers.map((answer) => (
          <li key={answer.question} className="text-gray-700">
            {answer.question}: {answer.selected}
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1 border-t border-gray-200 pt-2 text-sm text-gray-600">
        <div className="flex gap-1">
          <dt className="font-medium text-gray-700">Telefon:</dt>
          <dd>{request.contact?.phone || "Belirtilmemiş"}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium text-gray-700">Konum:</dt>
          <dd>{request.location ? "Eklendi" : "Belirtilmemiş"}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="font-medium text-gray-700">Durumu:</dt>
          <dd>
            <StatusBadge status={request.status} isExpired={request.isExpired} />
          </dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium text-gray-700">Süre:</dt>
          <dd>{formatDateRange(request.startsAt, request.endsAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
