"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Hesap Bilgilerim", href: "/hesap-bilgilerim" },
  { label: "Veri Gizliliği", href: "/veri-gizliligi" },
];

export function SettingsHeader({ onLogout, isLoggingOut }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="w-full">
      <div className="flex flex-col items-center sm:h-20 sm:flex-row sm:justify-between">
        <div className="border-b border-gray-200 bg-white px-4 py-4">
          <Link href="/ana-sayfa" className="flex items-center gap-3">
            <Image src="/sidebarLogo.png" alt="" width={44} height={40} className="h-10 w-11 rounded-xl object-cover" />
            <span>
              <span className="block text-lg text-[#4E244D]">Hizmet Kap</span>
              <span className="block text-xs text-gray-500">Hizmet yönetim platformu</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Ayarlar" className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive ? "text-[#4E244D] underline" : "text-gray-600 hover:bg-white hover:text-[#4E244D]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-white hover:text-[#4E244D]"
          >
            Çıkış yap
          </button>
        </nav>
      </div>

      <div className="bg-gray-100 pl-10">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Geri dön"
          className="ml-4 p-1 text-[#6B4F6D]"
        >
          <ArrowLeft size={25} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
