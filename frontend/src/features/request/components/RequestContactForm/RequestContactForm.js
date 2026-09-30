"use client";

import { Button } from "@/shared/components/atoms";
import { EndDateField } from "./EndDateField";
import { LocationField } from "./LocationField";
import { PhoneField } from "./PhoneField";

export function RequestContactForm({ form, onSubmit, onDetectLocation, onClearLocation, isLocating, isSaving }) {
  const {
    register,
    watch,
    formState: { errors, isDirty },
  } = form;

  return (
    <section aria-labelledby="contact-form-title" className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <h2 id="contact-form-title" className="text-lg text-[#222C31]">
          İletişim Bilgilerini ve Konumunu Eklemek İster misin?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Bu bilgiler yalnızca seninle mesajlaşan kullanıcılara gösterilir.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <LocationField
          location={watch("location")}
          onDetect={onDetectLocation}
          onClear={onClearLocation}
          isLocating={isLocating}
        />
        <PhoneField registration={register("phone")} error={errors.phone?.message} />
        <EndDateField registration={register("endsAt")} error={errors.endsAt?.message} />

        <div className="pt-2">
          <Button type="submit" variant="primary" disabled={!isDirty || isSaving}>
            {isSaving ? "Kaydediliyor..." : "Tümünü Kaydet"}
          </Button>
        </div>
      </form>
    </section>
  );
}
