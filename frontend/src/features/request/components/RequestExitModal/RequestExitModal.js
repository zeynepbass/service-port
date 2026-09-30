
"use client";

import { Button, Heading } from "@/shared/components/atoms";

export function RequestExitModal({
  open,
  onClose,
  onExit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222C31]/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-xl">


        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE7F1]">
            <span className="text-xl  text-[#6B4F6D]">
              ?
            </span>
          </div>

          <Heading
            variant="dark"
            title="Emin misin?"
            desc="Birkaç soruya daha cevap vererek ücretsiz teklif alabilirsin."
          />
        </div>


        <div className="space-y-3">

          <Button
            onClick={onExit}
            className="w-full rounded-xl bg-[#6B4F6D] py-3 text-sm  text-white shadow-sm transition-all duration-200 hover:bg-[#4E244D]"
          >
            Çık
          </Button>

          <Button
            onClick={onClose}
            className="w-full rounded-xl border border-[#DCD0E3] bg-white py-3 text-sm font-medium text-[#6B4F6D] transition-all duration-200 hover:bg-[#EDE7F1]"
          >
            Devam et
          </Button>

        </div>
      </div>
    </div>
  );
}
