import { Phone } from "lucide-react";
import { Input } from "@/shared/components/atoms";
import { ContactFieldCard } from "./ContactFieldCard";

export function PhoneField({ registration, error }) {
  return (
    <ContactFieldCard
      icon={Phone}
      iconClassName="bg-[#EDE7F1] text-[#6B4F6D]"
      label="Telefon"
      labelId="contact-phone-label"
    >
      <Input
        type="tel"
        autoComplete="tel"
        aria-labelledby="contact-phone-label"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "contact-phone-error" : undefined}
        placeholder="+90 5XX XXX XX XX"
        className="mt-1 w-full rounded-lg border border-gray-200 bg-[#F7F7F9] px-3 py-2 text-sm text-[#222C31] outline-none transition focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]"
        {...registration}
      />
      {error && (
        <p id="contact-phone-error" role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </ContactFieldCard>
  );
}
