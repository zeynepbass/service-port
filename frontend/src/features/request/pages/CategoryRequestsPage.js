
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Heading } from "@/shared/components/atoms";
import { KullaniciCard } from "../components/KullaniciCard";
import { toDisplay } from "../helpers/toDisplay";
import { filterTadilat } from "../utils/filter";
import { useTadilat } from "../hooks/useUser";

export default function Users({ isim }) {
  const router = useRouter();

  const [kullaniciStored, setKullaniciStored] = useState(null);
  const [storedKullaniciAdi, setStoredKullaniciAdi] = useState(null);

  const {
    users,
    tadilat,
    isLoading,
  } = useTadilat();

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    const storedName = localStorage.getItem("kullaniciAdi");

    setKullaniciStored(storedUser);
    setStoredKullaniciAdi(storedName);
  }, []);

  const filteredTadilat = filterTadilat(
    tadilat,
    isim,
    storedKullaniciAdi,
    kullaniciStored
  );

  const categoryTitle = toDisplay(
    filteredTadilat[0]?.anaBaslik || isim
  );

  const handleMessage = (kullaniciId) => {
    router.push(`/mesaj-kutusu/${kullaniciId}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-3 h-8 w-64 rounded bg-gray-200" />

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 rounded-2xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">

        <header className="mb-8">
          <span className="text-sm font-medium text-[#6B4F6D]">
            Hizmetler
          </span>

          <div className="mt-1 flex justify-start">
            <div>
              <Heading
                title={categoryTitle}
                className="text-2xl text-left  tracking-tight text-gray-800 sm:text-3xl"
              />

              <p className="mt-2 text-sm text-gray-500">
                Bu kategoride hizmet veren kullanıcıları keşfet.
              </p>
            </div>

            {filteredTadilat.length > 0 && (
              <span className="w-fit rounded-full bg-[#EDE7F1] px-3 py-1.5 text-xs font-medium text-[#6B4F6D]">
                {filteredTadilat.length} hizmet
              </span>
            )}
          </div>
        </header>


        {filteredTadilat.length > 0 ? (
          <section>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...filteredTadilat]
                .reverse()
                .map((slide) => (
                  <KullaniciCard
                    key={slide._id}
                    slide={slide}
                    onMessage={() =>
                      handleMessage(slide.kullaniciId)
                    }
                  />
                ))}
            </div>
          </section>
        ) : (
          <section className="flex min-h-[360px] items-center justify-center rounded-3xl border border-gray-200 bg-white">
            <div className="px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDE7F1]">
                <span className="text-2xl text-[#6B4F6D]">
                  —
                </span>
              </div>

              <h2 className="mt-5 text-lg  text-gray-800">
                Henüz hizmet bulunamadı
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
                Bu kategoriye ait henüz yayınlanmış bir tadilat
                hizmeti bulunmuyor.
              </p>
            </div>
          </section>
        )}


        {filteredTadilat.length > 0 && (
          <div className="mt-6 flex items-center gap-2 px-2 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9A6BF]" />
            <span>
              İhtiyacına uygun hizmeti seçerek kullanıcıyla iletişime
              geçebilirsin.
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
