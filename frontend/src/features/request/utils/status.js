export const STATUS_LABELS = {
  active: "Aktif",
  passive: "Pasif",
  cancelled: "İptal edildi",
};

export const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700",
  passive: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-50 text-red-600",
};

export function nextToggleStatus(status) {
  return status === "active" ? "passive" : "active";
}
