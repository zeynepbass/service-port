import { STATUS_LABELS, STATUS_STYLES } from "../../utils/status";

export function StatusBadge({ status, isExpired }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.passive}`}
    >
      {STATUS_LABELS[status] ?? status}
      {isExpired && " (süresi doldu)"}
    </span>
  );
}
