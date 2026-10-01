import Image from "next/image";
import Link from "next/link";

export function SidebarSearchResults({ id, categories, query, onSelect }) {
  return (
    <div id={id}>
      <p className="mb-3 px-2 text-xs uppercase tracking-wider text-gray-500">Popüler Hizmetler</p>
      <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm" aria-live="polite">
        {categories.length === 0 ? (
          <p className="px-3 py-2.5 text-sm text-gray-500">
            {query.trim() ? `"${query}" için sonuç bulunamadı.` : "Gösterilecek hizmet bulunamadı."}
          </p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategori/${category.slug}`}
                  onClick={onSelect}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#F1EDF5]"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                  )}
                  <span className="text-sm font-medium capitalize text-gray-700">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
