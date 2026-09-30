
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { register } from  "../api/user.api";

export function useRegister  ()  {
  const router = useRouter();

  const [kullaniciStorage, setKullaniciStore] = useState(null);

  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    parola: "",
  });

  useEffect(() => {
    const store = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    setKullaniciStore(store);
  }, []);

  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: (res) => {
      if (!res.data?.yeniKullanici) {
        toast.error(
          "Kayıt sırasında beklenmedik bir cevap alındı",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );

        return;
      }

      toast.success(
        res.data.message || "Kayıt başarılı!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      localStorage.setItem(
        "kullanici",
        JSON.stringify(res.data.yeniKullanici)
      );

      localStorage.removeItem("kullaniciAdi");

      setTimeout(() => {
        router.push("/");
      }, 100);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Bir hata oluştu",
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

    registerMutation.mutate(formData);
  };

  return {
    formData,
    kullaniciStorage,

    handleChange,
    handleSubmit,

    isLoading: registerMutation.isPending,
  };
};

