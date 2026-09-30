
"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { updateAccountInfo as updateHesap } from  "../api/user.api";

export function useAccount () {
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
  });

  const [telefon, setTelefon] = useState("");
  const [resim, setResim] = useState(null);
  const [preview, setPreview] = useState(null);
  const [kullaniciStorage, setKullaniciStore] = useState(null);

  useEffect(() => {
    const store = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    setKullaniciStore(store);

    if (store) {
      setForm({
        ad: store.ad || "",
        soyad: store.soyad || "",
        email: store.email || "",
      });

      setTelefon(store.telefon || "");
      setPreview(store.resim || null);
    }
  }, []);

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, formData }) =>
      updateHesap(id, formData),

    onSuccess: (res) => {
      toast.success("Bilgiler başarıyla güncellendi!", {
        position: "top-right",
        autoClose: 3000,
      });

      const kullanici = {
        ...res.data.kullanici,
        id: res.data.kullanici._id,
      };

      localStorage.setItem(
        "kullanici",
        JSON.stringify(kullanici)
      );

      setKullaniciStore(kullanici);
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        "Sunucu hatası veya güncelleme başarısız!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResim(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = kullaniciStorage?.id;

    if (!id) {
      toast.error("Kullanıcı bulunamadı!");
      return;
    }

    const formData = new FormData();

    formData.append("ad", form.ad);
    formData.append("soyad", form.soyad);
    formData.append("email", form.email);
    formData.append("telefon", telefon);

    if (resim) {
      formData.append("resim", resim);
    }

    updateAccountMutation.mutate({
      id,
      formData,
    });
  };

  return {
    form,
    telefon,
    resim,
    preview,
    kullaniciStorage,

    setTelefon,

    handleChange,
    handleFileChange,
    handleSubmit,

    isLoading: updateAccountMutation.isPending,
  };
};

