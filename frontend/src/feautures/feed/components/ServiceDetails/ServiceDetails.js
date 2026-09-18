
"use client";

import { Heading } from "@/shared/components/atoms";
import { Location } from "@/shared/components/organism";

export function ServiceDetails({ data }) {
  return (
    <section className="mt-8">


      <div className="mb-6">
        <Heading
          title="Detaylar"
          className="text-2xl  tracking-tight text-[#222C31]"
        />
      </div>


      <div className="overflow-hidden m-3 rounded-2xl border border-gray-200 bg-white shadow-sm">


        <div className="border-b border-gray-100 px-5 py-5 md:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
            HİZMET KATEGORİSİ
          </span>

          <p className="mt-2 text-base  text-[#222C31]">
            {data?.[0]?.anaBaslik || "Belirtilmemiş"}
          </p>
        </div>


        <div className="grid grid-cols-1 gap-5 px-5 py-5 md:grid-cols-2 md:px-6">


          <div className="rounded-xl bg-[#FCFBFD] p-4">
            <span className="text-xs font-medium text-gray-400">
              Durum
            </span>

            <p className="mt-1 text-sm  text-[#6B4F6D]">
              {data?.[0]?.durum || "Belirtilmemiş"}
            </p>
          </div>


          <div className="rounded-xl bg-[#FCFBFD] p-4">
            <span className="text-xs font-medium text-gray-400">
              İlan Tarihi
            </span>

            <p className="mt-1 text-sm  text-[#222C31]">
              {data?.[0]?.baslangicTarihi
                ? new Date(data?.[0]?.baslangicTarihi).toLocaleDateString("tr-TR")
                : "Belirtilmemiş"}

              {data?.[0]?.bitisTarihi && (
                <span className="text-gray-400">
                  {" "}
                  -{" "}
                  {new Date(data?.[0]?.bitisTarihi).toLocaleDateString("tr-TR")}
                </span>
              )}
            </p>
          </div>

        </div>


        {data?.[0]?.konum && (
          <div className="border-t border-gray-100 px-5 py-5 md:px-6">
            <div className="mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
                Konum
              </span>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#FCFBFD] p-4">
              <Location konum={data?.[0]?.konum} />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
