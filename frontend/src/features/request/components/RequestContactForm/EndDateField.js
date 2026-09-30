import { CalendarClock } from "lucide-react";
import { Input } from "@/shared/components/atoms";
import { toDateInputValue } from "@/shared/utils/format";
import { ContactFieldCard } from "./ContactFieldCard";

export function EndDateField({ registration, error }) {
  return (
    <ContactFieldCard
      icon={CalendarClock}
      iconClassName="bg-[#F4E6E8] text-[#A0616A]"
      label="Bitiş Tarihi"
      labelId="contact-end-date-label"
    >
      <Input
        type="date"
        min={toDateInputValue(new Date(Date.now() + 86400000))}
        aria-labelledby="contact-end-date-label"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "contact-end-date-error" : "contact-end-date-hint"}
        className="mt-1 w-full rounded-lg border border-gray-200 bg-[#F7F7F9] px-3 py-2 text-sm text-[#222C31] outline-none focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]"
        {...registration}
      />
      {error ? (
        <p id="contact-end-date-error" role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : (
        <p id="contact-end-date-hint" className="mt-1 text-xs text-gray-500">
          Boş bırakırsan talep süresiz kalır.
        </p>
      )}
    </ContactFieldCard>
  );
}
