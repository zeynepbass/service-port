"use client";

import { Button, Heading } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export function ResetPasswordForm({ form, onSubmit, isLoading }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-lg bg-white p-10 shadow-lg">
      <Heading variant="dark" title="YENİ PAROLA BELİRLE" desc="Hesabın için yeni bir parola belirle." />

      <TextField
        id="reset-password"
        label="Yeni parola"
        srOnlyLabel
        type="password"
        autoComplete="new-password"
        placeholder="Yeni parola*"
        variant="accent"
        hint="En az 8 karakter, bir harf ve bir rakam"
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        id="reset-password-confirm"
        label="Yeni parola tekrar"
        srOnlyLabel
        type="password"
        autoComplete="new-password"
        placeholder="Yeni parola tekrar*"
        variant="accent"
        error={errors.passwordConfirm?.message}
        {...register("passwordConfirm")}
      />

      <Button type="submit" variant="brand" disabled={isLoading} className="w-1/2">
        {isLoading ? "Güncelleniyor..." : "Parolayı Güncelle"}
      </Button>
    </form>
  );
}
