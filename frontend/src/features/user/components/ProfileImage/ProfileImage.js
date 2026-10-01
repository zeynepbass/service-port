"use client";

import { Avatar } from "@/shared/components/atoms";

export function ProfileImage({ src, name, fallback, onSelect, error }) {
  return (
    <div className="flex w-full flex-col items-center lg:items-start">
      <Avatar
        src={src}
        name={name}
        fallback={fallback}
        size="lg"
        className="rounded-2xl border border-gray-200"
      />

      <label
        htmlFor="profile-image"
        className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-xl border border-[#DCD0E3] bg-[#F7F3F8] px-4 py-2.5 text-sm font-medium text-[#6B4F6D] transition focus-within:ring-2 focus-within:ring-[#6B4F6D] hover:bg-[#EDE7F1]"
      >
        Fotoğrafı Değiştir
        <input
          id="profile-image"
          type="file"
          className="sr-only"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby="profile-image-hint"
          onChange={onSelect}
        />
      </label>

      <p id="profile-image-hint" className="mt-2 text-center text-xs leading-5 text-gray-500 lg:text-left">
        JPG, PNG veya WEBP
        <br />
        Maksimum 5 MB
      </p>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
