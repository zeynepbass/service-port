"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/atoms";

export function RequestSuccess({ request, onCancel, isCancelling, isCancelled }) {
  return (
    <section className="mx-auto mt-10 w-[90%] max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-8 text-center md:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE7F1]">
          <span className="text-2xl text-[#6B4F6D]" aria-hidden="true">
            ✓
          </span>
        </div>

        <h1 className="mt-5 text-2xl tracking-tight text-[#222C31]" role="status">
          {isCancelled ? "Talebin iptal edildi" : "Talebini Aldık"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          {isCancelled
            ? "Dilediğin zaman yeni bir talep oluşturabilirsin."
            : "Talebin başarıyla oluşturuldu. Hizmet verenler sana mesaj kutusundan ulaşabilir."}
        </p>

        <Link
          href={`/hizmet/${request.id}`}
          className="mt-4 inline-block text-sm font-medium text-[#6B4F6D] underline-offset-4 transition hover:text-[#4E244D] hover:underline"
        >
          Talep detaylarını görüntüle
        </Link>

        <div className="mx-auto mt-8 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-[#FCFBFD]">
          <Image src="/2769497.png" alt="" width={260} height={200} className="h-full w-auto object-contain p-5" />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!isCancelled && (
            <Button onClick={onCancel} disabled={isCancelling} variant="outline" className="w-auto px-6">
              Talebi iptal et
            </Button>
          )}
          <Link
            href="/ana-sayfa"
            className="rounded-xl bg-[#6B4F6D] px-6 py-3 text-sm text-white shadow-sm transition-all duration-200 hover:bg-[#4E244D]"
          >
            İşlerime git
          </Link>
        </div>
      </div>
    </section>
  );
}
