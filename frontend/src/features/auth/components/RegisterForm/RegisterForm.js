
"use client";

import { Button, Heading, Input } from "@/shared/components/atoms";

export function RegisterForm({
  formData,
  handleChange,
  handleSubmit,
  kullaniciStorage,
}) {
  return (
    <div className="flex w-full items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 "
      >
        <div className="mb-3">
          <Heading
            variant="login"
            title={kullaniciStorage ? "Kayıt Ol" : "Kaydet"}
            desc={
              <>
                Kayıt olarak{" "}
                <span className="cursor-pointer underline">
                  Gizlilik Politikası
                </span>{" "}
                ve{" "}
                <span className="cursor-pointer underline">
                  Kullanım Şartlarını
                </span>{" "}
                kabul etmiş olursunuz.
              </>
            }
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            name="ad"
            value={formData.ad}
            onChange={handleChange}
            placeholder="Ad*"
            variant="auth"
            className="flex-1"
          />

          <Input
            type="text"
            name="soyad"
            value={formData.soyad}
            onChange={handleChange}
            placeholder="Soyad*"
            variant="auth"
            className="flex-1"
          />
        </div>

        <Input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email*"
          variant="auth"
        />

        <Input
          type="password"
          name="parola"
          value={formData.parola}
          onChange={handleChange}
          placeholder="Parola*"
          variant="auth"
        />

        <Button
          type="submit"
          variant="brand"
        >
          {kullaniciStorage ? "Kayıt Ol" : "Kaydet"}
        </Button>
      </form>
    </div>
  );
}
