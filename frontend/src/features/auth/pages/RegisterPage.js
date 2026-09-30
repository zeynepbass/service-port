"use client";

import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const { form, onSubmit, isLoading } = useRegister();

  return (
    <AuthCard image="/kayit.jpg">
      <RegisterForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
    </AuthCard>
  );
}
