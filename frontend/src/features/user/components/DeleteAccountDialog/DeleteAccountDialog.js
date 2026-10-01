"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/atoms";
import { Modal, TextField } from "@/shared/components/molecules";
import { deleteAccountSchema } from "../../utils/schemas";

export function DeleteAccountDialog({ open, onClose, onConfirm, isDeleting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(deleteAccountSchema), defaultValues: { password: "" } });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hesabını kalıcı olarak sil"
      description="Bu işlem geri alınamaz. Devam etmek için parolanı gir."
    >
      <form onSubmit={handleSubmit(({ password }) => onConfirm(password))} noValidate className="space-y-4">
        <TextField
          id="delete-account-password"
          label="Parola"
          type="password"
          variant="settings"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" variant="danger" disabled={isDeleting}>
          {isDeleting ? "Siliniyor..." : "Hesabımı sil"}
        </Button>
        <Button onClick={onClose} variant="outline">
          Vazgeç
        </Button>
      </form>
    </Modal>
  );
}
