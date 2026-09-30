"use client";

import Link from "next/link";
import { Button, Heading } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export function ForgotPasswordForm({ form, onSubmit, isLoading, message }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-lg bg-white p-10 shadow-lg">
      <Heading
        variant="dark"
        title="ŞİFREMİ UNUTTUM"
        desc="E-posta adresini gir, parolanı sıfırlaman için bir bağlantı gönderelim."
      />

      {message ? (
        <p role="status" className="rounded-lg bg-[#EDE7F1] p-4 text-center text-sm text-[#4E244D]">
          {message}
        </p>
      ) : (
        <>
          <TextField
            id="forgot-email"
            label="E-posta"
            srOnlyLabel
            type="email"
            autoComplete="email"
            placeholder="Email*"
            variant="accent"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" variant="brand" disabled={isLoading} className="w-1/2">
            {isLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
          </Button>
        </>
      )}

      <Link href="/giris-yap" className="text-center text-sm text-gray-500 hover:text-[rgb(78,36,77)]">
        Girişe dön
      </Link>
    </form>
  );
}
