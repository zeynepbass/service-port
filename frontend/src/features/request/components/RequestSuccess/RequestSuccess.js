
"use client";

import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";
import { Button } from "@/shared/components/atoms";

export function RequestSuccess({
  dialog,
  handleClose,
  handleClick,
  storedData,
}) {
  const router = useRouter();

  return (
    <div className="mx-auto mt-10 w-[90%] max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <Snackbar
        open={dialog}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Başarıyla talep alındı!
        </Alert>
      </Snackbar>


      <div className="px-6 py-8 text-center md:px-10">

    
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE7F1]">
          <span className="text-2xl  text-[#6B4F6D]">
            ✓
          </span>
        </div>

        <h2 className="mt-5 text-2xl  tracking-tight text-[#222C31]">
          Talebini Aldık
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Talebin başarıyla oluşturuldu. İsteğinle ilgili gelişmeler
          olduğunda e-posta adresine bildirim göndereceğiz.
        </p>


        <a
          href={`/hizmet/${storedData}`}
          className="mt-4 inline-block text-sm font-medium text-[#6B4F6D] underline-offset-4 transition hover:text-[#4E244D] hover:underline"
        >
          Talep detaylarını görüntüle
        </a>


        <div className="mx-auto mt-8 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-[#FCFBFD]">
          <img
            src="/2769497.png"
            alt="Talep başarıyla oluşturuldu"
            className="h-full w-auto object-contain p-5"
          />
        </div>


        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Button
            type="button"
            onClick={handleClick}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-[#DCD0E3] hover:bg-[#F7F7F9] hover:text-[#4E244D]"
          >
            Talebi iptal et
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/ana-sayfa")}
            className="rounded-xl bg-[#6B4F6D] px-6 py-3 text-sm  text-white shadow-sm transition-all duration-200 hover:bg-[#4E244D]"
          >
            İşlerime git
          </Button>

        </div>
      </div>
    </div>
  );
}
