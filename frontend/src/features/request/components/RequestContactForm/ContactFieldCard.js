export function ContactFieldCard({ icon: Icon, iconClassName, label, labelId, children, action }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
            <Icon size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p id={labelId} className="text-xs font-medium text-gray-500">
              {label}
            </p>
            {children}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}
