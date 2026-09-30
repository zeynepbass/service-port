
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoginForm } from "../components/LoginForm";
import { LoginImage } from "../components/LoginImage";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
  } = useLogin();

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-2">

     
          <div className="flex items-center justify-center ">
            <div className="w-full max-w-md">
              <LoginForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>

        
          <div className="relative hidden min-h-[600px] overflow-hidden lg:block">
            <LoginImage />
          </div>

        </div>
      </div>
    </main>
  );
}

