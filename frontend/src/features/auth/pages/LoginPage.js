"use client";

import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage({ nextPath }) {
  const { form, onSubmit, isLoading } = useLogin(nextPath);

  return (
    <AuthCard image="/login.jpg">
      <LoginForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
    </AuthCard>
  );
}
