import { MapPinPlus } from "lucide-react";
import { Button } from "@/shared/components/atoms";
import { ContactFieldCard } from "./ContactFieldCard";

export function LocationField({ location, onDetect, onClear, isLocating }) {
  return (
    <ContactFieldCard
      icon={MapPinPlus}
      iconClassName="bg-[#FFF1E3] text-[#C77A12]"
      label="Konum"
      action={
        location ? (
          <Button onClick={onClear} variant="outline" className="w-full px-5 sm:w-auto">
            Konumu kaldır
          </Button>
        ) : (
          <Button
            onClick={onDetect}
            disabled={isLocating}
            className="w-full rounded-xl bg-[#B86A00] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#8F5200] sm:w-auto"
          >
            {isLocating ? "Konum alınıyor..." : "Konum Al"}
          </Button>
        )
      }
    >
      <p className="mt-1 text-sm text-gray-600">
        {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Konum verilmedi"}
      </p>
    </ContactFieldCard>
  );
}
