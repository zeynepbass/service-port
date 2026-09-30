
"use client";

import { Input } from "@/shared/components/atoms";

export function Profilmage({
  resim,
  preview,
  handleFileChange,
}) {
  return (
    <div className="flex w-full flex-col items-center lg:items-start">

      <div className="relative">
        {resim ? (
          <img
            src={preview}
            alt="Profil Fotoğrafı"
            className="h-40 w-40 rounded-2xl border border-gray-200 object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-gray-200 bg-[#F7F7F9]">
            <span className="text-4xl  uppercase text-[#B9A6BF]">
              ?
            </span>
          </div>
        )}
      </div>


      <label
        htmlFor="profile-image"
        className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-xl border border-[#DCD0E3] bg-[#F7F3F8] px-4 py-2.5 text-sm font-medium text-[#6B4F6D] transition hover:bg-[#EDE7F1]"
      >
        Fotoğrafı Değiştir

        <Input
          id="profile-image"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      <p className="mt-2 text-center text-xs leading-5 text-gray-400 lg:text-left">
        JPG, PNG veya WEBP
        <br />
        Maksimum 5 MB
      </p>
    </div>
  );
}

