
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  deleteAccount,
  updateAccount,
} from "@/feautures/feed/hooks/useDataPrivacy";

export function useDataPrivacy  () {
  const router = useRouter();

  const [openIndex, setOpenIndex] = useState(null);

  const updateAccountMutation = useMutation({
    mutationFn: (userId) => updateAccount(userId, false),

    onSuccess: (result) => {
      if (result.success) {
        localStorage.clear();
        router.push("/");
        return;
      }

      alert("Hesap durumu güncellenemedi");
    },

    onError: () => {
      alert("Hesap durumu güncellenemedi");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (userId) => deleteAccount(userId),

    onSuccess: () => {
      localStorage.clear();
      router.push("/");
    },

    onError: () => {
      alert("Hesap silinemedi");
    },
  });

  const toggle = (index) => {
    setOpenIndex((prev) =>
      prev === index ? null : index
    );
  };

  const getUserId = () => {
    const kullanici = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    return kullanici?.kullanici?.id;
  };

  const handleDurumDegistir = () => {
    const userId = getUserId();

    if (!userId) {
      alert("Kullanıcı bulunamadı");
      return;
    }

    updateAccountMutation.mutate(userId);
  };

  const handleHesapSil = () => {
    const userId = getUserId();

    if (!userId) {
      alert("Kullanıcı bulunamadı");
      return;
    }

    deleteAccountMutation.mutate(userId);
  };

  const handleAction = () => {
    if (openIndex === 0) {
      handleDurumDegistir();
    }

    if (openIndex === 1) {
      handleHesapSil();
    }
  };

  return {
    openIndex,
    toggle,
    handleAction,
    isLoading:
      updateAccountMutation.isPending ||
      deleteAccountMutation.isPending,
    isUpdating: updateAccountMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
  };
};

