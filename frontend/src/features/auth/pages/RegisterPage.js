
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RegisterForm } from "../components/RegisterForm";
import { RegisterImage } from "../components/RegisterImage";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const {
    formData,
    kullaniciStorage,
    handleChange,
    handleSubmit,
    isLoading,
  } = useRegister();

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-2">


          <div className="flex items-center justify-center">
            <RegisterForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              kullaniciStorage={kullaniciStorage}
              isLoading={isLoading}
            />
          </div>


          <div className="relative hidden min-h-[600px] overflow-hidden lg:block">
            <RegisterImage />
          </div>

        </div>
      </div>
    </main>
  );
}
