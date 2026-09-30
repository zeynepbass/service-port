"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";

const ITEMS_PER_VIEW = 3;

export function CategoryCarousel() {
  const { categories } = useCategories();
  const [current, setCurrent] = useState(0);
  const maxIndex = Math.max(categories.length - ITEMS_PER_VIEW, 0);

  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="trending-title" className="relative mx-auto w-[80%] p-5">
      <div className="flex items-center justify-between pb-3">
        <h2 id="trending-title" className="text-gray-600">
          Trend Hizmetler
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Önceki hizmetler"
            onClick={() => setCurrent((index) => (index <= 0 ? maxIndex : index - 1))}
            className="rounded-full bg-white/90 p-2 text-[rgb(34,44,49)] shadow hover:bg-white"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Sonraki hizmetler"
            onClick={() => setCurrent((index) => (index >= maxIndex ? 0 : index + 1))}
            className="rounded-full bg-white/90 p-2 text-[rgb(34,44,49)] shadow hover:bg-white"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(current * 100) / ITEMS_PER_VIEW}%)` }}
        >
          {categories.map((category) => (
            <li key={category.id} className="shrink-0 basis-1/3 px-2">
              <Link
                href={`/kategori/${category.slug}/talep-olustur`}
                className="block overflow-hidden rounded-xl bg-white shadow transition-shadow duration-200 hover:shadow-md"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt=""
                    width={400}
                    height={160}
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="h-40 w-full object-cover"
                  />
                )}
                <span className="block truncate p-3 text-center text-sm text-gray-700">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
