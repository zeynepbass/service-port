
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Login } from "../api/user.api";

export function useLogin () {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    parola: "",
  });



const loginMutation = useMutation({
  mutationFn: Login,

  onSuccess: (res) => {
    toast.success(res.message || "Giriş başarılı!", {
      position: "top-right",
      autoClose: 3000,
    });

    localStorage.setItem(
      "kullanici",
      JSON.stringify(res.kullanici)
    );

    if (res.token) {
      document.cookie = `token=${res.token}; path=/; max-age=${
        60 * 60 * 24
      }`;
    }

    router.push("/ana-sayfa");
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

    toast.dismiss();

    loginMutation.mutate(formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading: loginMutation.isPending,
  };
};

