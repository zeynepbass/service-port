"use client";

import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const { form, onSubmit, isLoading, message } = useForgotPassword();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F7F9] px-4">
      <div className="w-full max-w-xl">
        <ForgotPasswordForm form={form} onSubmit={onSubmit} isLoading={isLoading} message={message} />
      </div>
    </main>
  );
}
