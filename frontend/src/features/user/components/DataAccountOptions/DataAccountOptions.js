
"use client";

import { Button } from "@/shared/components/atoms";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export function DataAccountOptions({
  items,
  openIndex,
  toggle,
  handleAction,
}) {
  return (
    <div className="w-full space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
              isOpen
                ? "border-[#DCD0E3] shadow-sm"
                : "border-gray-200 hover:border-[#DCD0E3]"
            }`}
          >

            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <div>
                <h2
                  className={`text-sm  ${
                    isOpen ? "text-[#4E244D]" : "text-gray-700"
                  }`}
                >
                  {item.title}
                </h2>

                {!isOpen && (
                  <p className="mt-1 text-xs text-gray-400">
                    Detayları görüntülemek için tıklayın
                  </p>
                )}
              </div>

              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isOpen
                    ? "bg-[#EDE7F1] text-[#6B4F6D]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isOpen ? (
                  <KeyboardArrowDownIcon fontSize="small" />
                ) : (
                  <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                )}
              </span>
            </button>


            {isOpen && (
              <div className="border-t border-[#EDE7F1] bg-[#FCFBFD]">


                <div className="px-5 py-4">
                  <p className="text-sm leading-6 text-gray-500">
                    {item.content}
                  </p>
                </div>


                <div className="border-t border-[#EDE7F1] px-5 py-7 text-center">

                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#EDE7F1]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>

                  <h3 className="text-lg  text-gray-800">
                    {item.baslik}
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
                    {item.paragraf}
                  </p>

<Button
             type="button"
             onClick={handleAction}
             className="mt-6 rounded-xl bg-[#4E244D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6B4F6D]"
        
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
