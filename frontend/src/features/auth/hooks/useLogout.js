"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../api/auth.api";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      router.replace("/giris-yap");
      router.refresh();
    },
  });

  return { logout: () => mutation.mutate(), isLoggingOut: mutation.isPending };
}
