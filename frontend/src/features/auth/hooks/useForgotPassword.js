
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { forgotPassword } from  "../api/user.api";

export function useForgotPassword  ()  {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    yeniParola: "",
    yeniParolaTekrar: "",
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,

    onSuccess: (res) => {
      toast.success(
        res.data?.message || "Şifre başarıyla güncellendi!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      localStorage.clear();

      setTimeout(() => {
        router.push("/");
      }, 3000);
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Sunucu hatası veya güncelleme başarısız!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.yeniParola ||
      !formData.yeniParolaTekrar
    ) {
      toast.error("Lütfen tüm alanları doldurun!", {
        position: "top-right",
        autoClose: 3000,
      });

      return;
    }

    if (
      formData.yeniParola !==
      formData.yeniParolaTekrar
    ) {
      toast.error("Yeni şifreler eşleşmiyor!", {
        position: "top-right",
        autoClose: 3000,
      });

      return;
    }

    forgotPasswordMutation.mutate(formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading: forgotPasswordMutation.isPending,
  };
};

