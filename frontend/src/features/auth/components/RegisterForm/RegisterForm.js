"use client";

import Link from "next/link";
import { Button, Heading } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export function RegisterForm({ form, onSubmit, isLoading }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-4">
      <div className="mb-3">
        <Heading title="Kayıt Ol" desc="Kayıt olarak Gizlilik Politikası ve Kullanım Şartlarını kabul etmiş olursunuz." />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <TextField
          id="register-first-name"
          label="Ad"
          srOnlyLabel
          autoComplete="given-name"
          placeholder="Ad*"
          className="flex-1"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          id="register-last-name"
          label="Soyad"
          srOnlyLabel
          autoComplete="family-name"
          placeholder="Soyad*"
          className="flex-1"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <TextField
        id="register-email"
        label="E-posta"
        srOnlyLabel
        type="email"
        autoComplete="email"
        placeholder="Email*"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        id="register-password"
        label="Parola"
        srOnlyLabel
        type="password"
        autoComplete="new-password"
        placeholder="Parola*"
        hint="En az 8 karakter, bir harf ve bir rakam"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" variant="brand" disabled={isLoading}>
        {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Zaten hesabın var mı?{" "}
        <Link href="/giris-yap" className="text-[rgb(78,36,77)] underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
