
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Heading,
  Input,
} from "@/shared/components/atoms";

import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPassword() {
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
  } = useForgotPassword();

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-50">
      <ToastContainer />

      <div className="flex justify-center items-center w-[80%]">
        <div className="w-full max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-lg p-10 shadow-lg bg-white"
          >
            <Heading
              variant="dark"
              title="ŞİFRE DEĞİŞTİR"
              desc="Şifreni güncellemek için lütfen sırasıyla email ve yeni şifreni gir."
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
              variant="accent"
            />

            <Input
              type="password"
              name="yeniParola"
              value={formData.yeniParola}
              onChange={handleChange}
              placeholder="Yeni şifre*"
              variant="accent"
            />

            <Input
              type="password"
              name="yeniParolaTekrar"
              value={formData.yeniParolaTekrar}
              onChange={handleChange}
              placeholder="Yeni Şifre Tekrar*"
              variant="accent"
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-[50%] rounded-4xl mx-auto p-3 cursor-pointer bg-[rgb(78,36,77)] text-[rgb(242,247,250)] hover:text-gray-50 hover:bg-[rgb(255,127,60)] transition-colors duration-300 mt-2"
            >
              {isLoading ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

