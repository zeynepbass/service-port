"use client";

import Link from "next/link";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordPage({ token }) {
  const { form, onSubmit, isLoading } = useResetPassword(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F7F9] px-4">
      <div className="w-full max-w-xl">
        {token ? (
          <ResetPasswordForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
        ) : (
          <div role="alert" className="rounded-lg bg-white p-10 text-center shadow-lg">
            <p className="text-gray-600">Bağlantı geçersiz veya eksik.</p>
            <Link href="/sifremi-unuttum" className="mt-4 inline-block text-[rgb(78,36,77)] underline">
              Yeni bağlantı iste
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
