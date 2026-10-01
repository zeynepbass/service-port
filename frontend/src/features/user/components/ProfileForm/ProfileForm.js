"use client";

import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input/min";
import "react-phone-number-input/style.css";
import { Button } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export function ProfileForm({ form, onSubmit, isSaving }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-xl">
      <div className="space-y-5">
        <TextField
          id="profile-first-name"
          label="Ad"
          variant="settings"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          id="profile-last-name"
          label="Soyad"
          variant="settings"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
        <TextField
          id="profile-email"
          label="E-posta"
          type="email"
          variant="settings"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <label htmlFor="profile-phone" className="mb-2 block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <div className="rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 transition focus-within:border-[#B9A6BF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#EDE7F1]">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <PhoneInput
                  id="profile-phone"
                  international
                  defaultCountry="TR"
                  placeholder="Telefon numaranızı girin"
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value ?? "")}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.phone)}
                />
              )}
            />
          </div>
          {errors.phone && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#4E244D] px-7 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#6B4F6D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </form>
  );
}
