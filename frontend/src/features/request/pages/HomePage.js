
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { HomeSlider } from "../components/HomeSlider";
import { HomeIsTabs } from "../components/HomeIsTabs";
import { HomeEmptyState } from "../components/HomeEmptyState";
import { HomeIsCard } from "../components/HomeIsCard/HomeIsCard";
import { useTadilat } from "../hooks/usePost";
import {
  filterTadilatByStatus,
  filterTadilatByUser,
} from "../utils/filter";

export default function Home({ itemsAktif: initialItems }) {
  const router = useRouter();

  const [openIndex, setOpenIndex] = useState(0);
  const [storedData, setStoredData] = useState(null);

  const {
    itemsAktif,
    showText,
    handleSubmit,
  } = useTadilat(initialItems);

  const tabs = [
    {
      title: "Aktif işlerim",
      image: "9315312.png",
      content:
        "Aktif işin yok. Hemen kategorilerden, ihtiyacın olan hizmete kolayca ulaş.",
    },
    {
      title: "Pasif işlerim",
      image: null,
      content: "Aktif işin yok.",
      button: "Teklif gelmedi",
    },
  ];

  useEffect(() => {
    const kullanici = JSON.parse(
      localStorage.getItem("kullanici")
    );

    setStoredData(kullanici);
  }, []);

  const aktifMi = openIndex === 0;

  const seciliIsler = filterTadilatByStatus(
    itemsAktif,
    aktifMi ? "aktif" : "pasif"
  );

  const filteredData = filterTadilatByUser(
    seciliIsler,
    storedData?.email
  );

  return (
    <div className="min-h-screen flex flex-col">
      <HomeIsTabs
        tabs={tabs}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
      />

      <div className="h-[50vh]">
        {filteredData.length === 0 ? (
          <HomeEmptyState tab={tabs[openIndex]} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-[40vh]">
            {[...filteredData].reverse().map((item) => (
              <HomeIsCard
                key={item._id}
                item={item}
                showText={showText}
                handleSubmit={handleSubmit}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full pt-5 border-gray-100">
        <HomeSlider />
      </div>
    </div>
  );
}

