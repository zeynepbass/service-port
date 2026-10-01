"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { deactivateAccount, deleteAccount } from "../api/user.api";

export function useAccountActions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  function signOut(message) {
    queryClient.clear();
    toast.success(message);
    router.replace("/giris-yap");
    router.refresh();
  }

  const deactivate = useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => signOut("Hesabın donduruldu. Tekrar giriş yaparak aktifleştirebilirsin."),
    onError: (error) => toast.error(getErrorMessage(error, "Hesap dondurulamadı")),
  });

  const remove = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => signOut("Hesabın silindi."),
    onError: (error) => toast.error(getErrorMessage(error, "Hesap silinemedi")),
  });

  return {
    deactivate: () => deactivate.mutate(),
    remove: (password) => remove.mutate(password),
    isDeactivating: deactivate.isPending,
    isRemoving: remove.isPending,
  };
}
