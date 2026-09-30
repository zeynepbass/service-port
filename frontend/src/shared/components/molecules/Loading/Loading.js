export function Loading({ label = "Yükleniyor..." }) {
  return (
    <div className="flex h-[90vh] items-center justify-center bg-[#F7F7F9] pt-4" role="status" aria-live="polite">
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
