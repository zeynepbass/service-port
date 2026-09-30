"use client";

import { Star } from "lucide-react";

const STARS = [1, 2, 3, 4, 5];

export function StarRating({ value, onChange, label = "Puan" }) {
  function handleKeyDown(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(5, value + 1));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(1, value - 1));
    }
  }

  return (
    <div role="radiogroup" aria-label={label} className="flex justify-center gap-1" onKeyDown={handleKeyDown}>
      {STARS.map((star) => {
        const selected = star === value;
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${star} yıldız`}
            tabIndex={selected || (value === 0 && star === 1) ? 0 : -1}
            onClick={() => onChange(star)}
            className="rounded p-1 text-[#6B4F6D] transition hover:text-[#4E244D] focus-visible:outline-2 focus-visible:outline-[#6B4F6D]"
          >
            <Star size={28} aria-hidden="true" fill={filled ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
}
