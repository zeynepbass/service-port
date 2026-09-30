
"use client";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ScheduleIcon from "@mui/icons-material/Schedule";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import trLocale from "date-fns/locale/tr";

import { Button, Heading, Input } from "@/shared/components/atoms";

export function ServiceContactForm({
  location,
  phone,
  sure,
  promptPhone,
  setPhone,
  setSure,
  handleGetLocation,
  handleGetPhone,
  handleGetCalendar,
  handleSubmit,
}) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <Heading
          title="İletişim Bilgilerini ve Konumunu Eklemek İster misin?"
          className="text-lg  text-[#222C31]"
        />
        <p className="mt-2 text-sm text-gray-500">
          Hizmet talebin için iletişim ve konum bilgilerini ekleyebilirsin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E3]">
                <AddLocationAltIcon className="text-[#FFB049]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-400">
                  Konum
                </p>

                {location ? (
                  <Input
                    type="text"
                    value={location}
                    readOnly
                    className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-medium text-[#222C31] outline-none"
                    placeholder="Konumunuz"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Konum verilmedi
                  </p>
                )}
              </div>
            </div>

            {!location && (
              <Button
                type="button"
                onClick={handleGetLocation}
                className="w-full rounded-xl bg-[#FFB049] px-5 py-2.5 text-sm  text-white transition-colors hover:bg-[#FF7F3A] sm:w-auto"
              >
                Konum Al
              </Button>
            )}
          </div>
        </div>


        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDE7F1]">
                <LocalPhoneIcon className="text-[#6B4F6D]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-400">
                  Telefon
                </p>

                {promptPhone ? (
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-[#F7F7F9] px-3 py-2 text-sm text-[#222C31] outline-none transition focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]"
                    placeholder="Telefon numaranız"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Telefon verilmedi
                  </p>
                )}
              </div>
            </div>

            {!promptPhone && (
              <Button
                type="button"
                onClick={handleGetPhone}
                className="w-full rounded-xl bg-[#6B4F6D] px-5 py-2.5 text-sm  text-white transition-colors hover:bg-[#4E244D] sm:w-auto"
              >
                Telefon Ekle
              </Button>
            )}
          </div>
        </div>

  
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E6E8]">
                <ScheduleIcon className="text-[#C58E95]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-medium text-gray-400">
                  Bitiş Tarihi
                </p>

                {sure ? (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={trLocale}
                  >
                    <DatePicker
                      label="Tarih Seç"
                      value={sure}
                      onChange={(newValue) => setSure(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                ) : (
                  <p className="text-sm text-gray-500">
                    Bitiş süresi belirtilmemiş
                  </p>
                )}
              </div>
            </div>

            {!sure && (
              <Button
                type="button"
                onClick={handleGetCalendar}
                className="w-full rounded-xl bg-[#C58E95] px-5 py-2.5 text-sm  text-white transition-colors hover:bg-[#A97179] sm:w-auto"
              >
                Bitiş Tarihi Ekle
              </Button>
            )}
          </div>
        </div>


        {(promptPhone || location || sure) && (
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
            >
              Tümünü Kaydet
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}
