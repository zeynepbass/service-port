import Link from "next/link";

export function SidebarNav({ items, pathname, categories }) {
  return (
    <>
      <nav aria-label="Ana menü">
        <p className="mb-3 px-2 text-xs uppercase tracking-wider text-gray-500">Menü</p>
        <ul className="space-y-1.5">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-[#EDE7F1] text-[#4E244D]"
                      : "text-gray-600 hover:bg-white hover:text-[#4E244D]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? "bg-[#DCD0E3]" : "bg-gray-100"}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto rounded-full bg-[#6B4F6D] px-2 py-0.5 text-xs text-white">
                      {item.badge}
                      <span className="sr-only"> okunmamış mesaj</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {categories.length > 0 && (
        <nav aria-label="Hizmetler" className="mt-8">
          <p className="mb-3 px-2 text-xs uppercase tracking-wider text-gray-500">Hizmetler</p>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategori/${category.slug}`}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white"
                >
                  <span className="h-2 w-2 rounded-full bg-[#B9A6BF]" aria-hidden="true" />
                  <span className="text-sm text-gray-600">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
