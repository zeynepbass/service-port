
"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Button, Input } from "@/shared/components/atoms";

export function ProfileForm({
  form,
  telefon,
  setTelefon,
  handleChange,
  handleSubmit,
  isLoading,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl"
    >
      <div className="space-y-5">

        <div>
          <label
            htmlFor="ad"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Ad
          </label>

          <Input
            id="ad"
            type="text"
            name="ad"
            value={form.ad}
            onChange={handleChange}
            placeholder="Adınızı girin"
            variant="settings"
          />
        </div>


        <div>
          <label
            htmlFor="soyad"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Soyad
          </label>

          <Input
            id="soyad"
            type="text"
            name="soyad"
            value={form.soyad}
            onChange={handleChange}
            placeholder="Soyadınızı girin"
            variant="settings"
          />
        </div>


        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            E-posta
          </label>

          <Input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E-posta adresinizi girin"
            variant="settings"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Telefon
          </label>

          <div className="rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 transition focus-within:border-[#B9A6BF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#EDE7F1]">
            <PhoneInput
              international
              defaultCountry="TR"
              placeholder="Telefon numaranızı girin"
              value={telefon}
              onChange={setTelefon}
              className="phone-input"
            />
          </div>
        </div>
      </div>


      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-[#4E244D] px-7 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#6B4F6D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </form>
  );
}

