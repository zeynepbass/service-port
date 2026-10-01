"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { SearchBar } from "@/shared/components/molecules";
import { SidebarNav } from "./SidebarNav";
import { SidebarSearchResults } from "./SidebarSearchResults";

function filterCategories(categories, query) {
  const normalized = query.trim().toLocaleLowerCase("tr-TR");
  if (!normalized) return categories;
  return categories.filter((category) => category.name.toLocaleLowerCase("tr-TR").includes(normalized));
}

export function Sidebar({ navItems, categories = [], account }) {
  const pathname = usePathname();
  const resultsId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterCategories(categories, query), [categories, query]);

  return (
    <aside className="flex h-screen w-full flex-col border-r border-gray-200 bg-[#F7F7F9]">
      <div className="border-b border-gray-200 bg-white px-5 py-5">
        <Link href="/ana-sayfa" className="flex items-center gap-3">
          <Image
            src="/sidebarLogo.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl border border-gray-200 object-cover"
          />
          <span>
            <span className="block text-lg text-[#4E244D]">Hizmet Kap</span>
            <span className="block text-xs text-gray-500">Hizmet yönetim platformu</span>
          </span>
        </Link>
      </div>

      <div className="px-5 pt-5">
        <SearchBar
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onToggle={() => setOpen((previous) => !previous)}
          expanded={open}
          controls={resultsId}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {open ? (
          <SidebarSearchResults
            id={resultsId}
            categories={filtered}
            query={query}
            onSelect={() => setOpen(false)}
          />
        ) : (
          <SidebarNav items={navItems} pathname={pathname} categories={categories.slice(0, 5)} />
        )}
      </div>

      <div className="p-4">{account}</div>
    </aside>
  );
}
