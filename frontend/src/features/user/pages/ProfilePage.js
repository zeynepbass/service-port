
"use client";

import { ToastContainer } from "react-toastify";

import { ProfileForm } from "../components/ProfileForm";
import { Profilmage } from "../components/Profilmage";
import { useAccount } from "../hooks/useAccount";

export default function Profil() {
  const {
    form,
    telefon,
    resim,
    preview,
    kullaniciStorage,
    setTelefon,
    handleChange,
    handleFileChange,
    handleSubmit,
    isLoading,
  } = useAccount();

  if (!kullaniciStorage) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-10">
      <ToastContainer />

      <div className="mx-auto w-full max-w-4xl">

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#6B4F6D]">
            Hesap
          </p>

          <h1 className="text-2xl  tracking-tight text-gray-800 sm:text-3xl">
            Profil Bilgileri
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Kişisel bilgilerini ve profil fotoğrafını buradan
            güncelleyebilirsin.
          </p>
        </div>


        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 bg-[#FCFBFD] px-6 py-5 sm:px-8">
            <h2 className="text-base  text-gray-800">
              Kişisel Bilgiler
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Profilinde görüntülenecek bilgileri düzenle.
            </p>
          </div>


          <div className="px-6 py-8 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

              <div className="flex justify-center lg:justify-start">
                <Profilmage
                  preview={preview}
                  resim={resim}
                  handleFileChange={handleFileChange}
                />
              </div>


              <div className="min-w-0">
                <ProfileForm
                  form={form}
                  telefon={telefon}
                  setTelefon={setTelefon}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

