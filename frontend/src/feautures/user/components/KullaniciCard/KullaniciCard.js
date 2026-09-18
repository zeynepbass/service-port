
"use client";

import { Button } from "@/shared/components/atoms";
import { Location as Konum } from "@/shared/components/organism";

export function KullaniciCard({ slide, onMessage }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[#DCD0E3] hover:shadow-md">


      <div className="border-b border-gray-100 px-5 py-5">

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDE7F1] text-sm  text-[#6B4F6D]">
            {slide?.ad?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400">
              Hizmeti Yayınlayan
            </p>

            <p className="truncate text-sm  text-[#222C31]">
              {slide?.ad?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="space-y-3">

          <div>
            <p className="text-xs text-gray-400">
              Telefon
            </p>

            <p className="mt-1 text-sm font-medium text-[#222C31]">
              {slide?.telefonNo || "Belirtilmemiş"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              E-posta
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#222C31]">
              {slide?.email || "Belirtilmemiş"}
            </p>
          </div>

          {slide?.konum && (
            <div>
              <p className="mb-1 text-xs text-gray-400">
                Konum
              </p>

              <div className="text-sm text-[#222C31]">
                <Konum konum={slide.konum} />
              </div>
            </div>
          )}

        </div>
      </div>


      <div className="px-5 py-5">

        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
              Kategori
            </p>

            <p className="mt-1 text-sm  text-[#222C31]">
              {slide?.kategoriIsim || "Belirtilmemiş"}
            </p>
          </div>

          <span className="rounded-full bg-[#EDE7F1] px-3 py-1 text-xs font-medium text-[#6B4F6D]">
            Hizmet
          </span>
        </div>


        <div className="mb-5 rounded-xl bg-[#FCFBFD] p-4">
          <p className="text-xs font-medium text-gray-400">
            İlan Tarihi
          </p>

          <p className="mt-1 text-sm  text-[#222C31]">
            {slide?.baslangicTarihi && slide?.bitisTarihi
              ? `${new Date(
                  slide.baslangicTarihi
                ).toLocaleDateString("tr-TR")} - ${new Date(
                  slide.bitisTarihi
                ).toLocaleDateString("tr-TR")}`
              : "Süresiz"}
          </p>
        </div>


        {slide?.veriler?.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
              Hizmet Detayları
            </p>

            <div className="space-y-2">
              {slide.veriler.map((veri, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-[#FCFBFD] p-4 transition-colors duration-200 hover:border-[#DCD0E3]"
                >
                  <p className="text-sm  text-[#222C31]">
                    {veri?.kategoriIsim}
                  </p>

                  {veri?.secilen && (
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium text-[#6B4F6D]">
                        Seçilen:
                      </span>{" "}
                      {veri.secilen}
                    </p>
                  )}

                  {veri?.secenekler?.length > 0 && (
                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Seçenekler: {veri.secenekler.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        <div className="mt-6 border-t border-gray-100 pt-5">
          <Button
            type="button"
            onClick={onMessage}
            variant="primary"
          >
            Mesaj Gönder
          </Button>
        </div>

      </div>
    </div>
  );
}
