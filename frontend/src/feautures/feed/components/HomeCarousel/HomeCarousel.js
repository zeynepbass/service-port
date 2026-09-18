"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/atoms";
export function HomeCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const [userControl, setUserControl] = useState(null);
  const itemsPerView = 3;
  const router = useRouter();

  const maxIndex = Math.max(slides.length - itemsPerView, 0);

  const prev = () => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  };

  const next = () => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  };

  useEffect(() => {
    setUserControl(localStorage.getItem("kullaniciAdi"));
  }, []);

  return (
    <div className="relative p-5 w-[80%] mx-auto">
      <div className={`${userControl ? "opacity-50 pointer-events-none" : ""}`}>
        <h6 className=" pb-3 text-gray-600">Trend Hizmetler</h6>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(current * 100) / itemsPerView}%)`,
              width: `${(slides.length * 100) / itemsPerView}%`,
            }}
          >
            <div className="flex">
              {slides?.map((slide, idx) => (
                <div
                  key={slide._id ?? idx}
                  onClick={() => router.push(`/detay/${slide._id}`)}
                  className="px-2 cursor-pointer basis-1/4"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow duration-200">
                    <img
                      src={slide.resim}
                      alt={slide.isim}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-center text-gray-700  text-sm truncate">
                        {slide.isim}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button
        onClick={prev}
        className="absolute right-20 top-5 -translate-y-1/2 text-[rgb(34,44,49)] bg-white/90 p-2 rounded-full shadow hover:bg-white z-10"

  type="button"

>
◀
</Button>
<Button
  type="button"
        onClick={next}
        className="absolute right-10 top-5 -translate-y-1/2 text-[rgb(34,44,49)] bg-white/90 p-2 rounded-full shadow hover:bg-white z-10"
      >
        ▶
</Button>

      </div>
    </div>
  );
}
