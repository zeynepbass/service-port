"use client";

import Link from "next/link";
import { Button, Heading } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export function LoginForm({ form, onSubmit, isLoading }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-3">
      <div className="mb-3">
        <Heading title="GİRİŞ YAP" desc="Güvenliğiniz için yalnızca kendi cihazlarınızdan giriş yapın." />
      </div>

      <TextField
        id="login-email"
        label="E-posta"
        srOnlyLabel
        type="email"
        autoComplete="email"
        placeholder="Email*"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        id="login-password"
        label="Parola"
        srOnlyLabel
        type="password"
        autoComplete="current-password"
        placeholder="Parola*"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="mt-1 flex items-center justify-between gap-4">
        <Link href="/sifremi-unuttum" className="text-sm text-gray-500 transition-colors hover:text-[rgb(78,36,77)]">
          Şifremi unuttum
        </Link>
        <Link href="/kayit-ol" className="text-sm text-gray-500 transition-colors hover:text-[rgb(78,36,77)]">
          Kayıt ol
        </Link>
      </div>

      <Button type="submit" variant="brand" disabled={isLoading}>
        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  );
}
