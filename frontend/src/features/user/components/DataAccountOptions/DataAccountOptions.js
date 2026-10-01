"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/components/atoms";

export function DataAccountOptions({ items, openKey, onToggle, onAction, busyKey }) {
  return (
    <div className="w-full space-y-3">
      {items.map((item) => {
        const isOpen = openKey === item.key;
        const panelId = `account-option-${item.key}`;

        return (
          <div
            key={item.key}
            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
              isOpen ? "border-[#DCD0E3] shadow-sm" : "border-gray-200 hover:border-[#DCD0E3]"
            }`}
          >
            <h2>
              <button
                type="button"
                onClick={() => onToggle(item.key)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >
                <span>
                  <span className={`block text-sm ${isOpen ? "text-[#4E244D]" : "text-gray-700"}`}>
                    {item.title}
                  </span>
                  {!isOpen && (
                    <span className="mt-1 block text-xs text-gray-500">
                      Detayları görüntülemek için tıklayın
                    </span>
                  )}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isOpen ? "bg-[#EDE7F1] text-[#6B4F6D]" : "bg-gray-100 text-gray-500"}`}
                >
                  {isOpen ? (
                    <ChevronDown size={18} aria-hidden="true" />
                  ) : (
                    <ChevronRight size={18} aria-hidden="true" />
                  )}
                </span>
              </button>
            </h2>

            {isOpen && (
              <div id={panelId} className="border-t border-[#EDE7F1] bg-[#FCFBFD]">
                <p className="px-5 py-4 text-sm leading-6 text-gray-500">{item.content}</p>
                <div className="border-t border-[#EDE7F1] px-5 py-7 text-center">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#EDE7F1]">
                    <Image
                      src={item.image}
                      alt=""
                      width={96}
                      height={96}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                  <h3 className="text-lg text-gray-800">{item.heading}</h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">{item.description}</p>
                  <Button
                    onClick={() => onAction(item.key)}
                    disabled={busyKey === item.key}
                    className="mt-6 rounded-xl bg-[#4E244D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6B4F6D] disabled:opacity-50"
                  >
                    {item.button}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
