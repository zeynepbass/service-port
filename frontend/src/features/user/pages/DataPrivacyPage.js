
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteAccount as accountDelete,
  updateAccount,
} from "@/feautures/user/api/user.api";

import { DataAccountOptions } from "../components/DataAccountOptions";

export default function Verigizlilik() {
  const router = useRouter();

  const items = [
    {
      title: "Hesabı dondur",
      image: "9318694.jpg",
      content:
        "Verilerini kaybetmeden hesabını geçici olarak dondurabilir, istediğin zaman giriş yaparak tekrar aktifleştirebilirsin.",
      baslik: "Araya mı ihtiyacın var?",
      paragraf:
        "Hesabını devre dışı bıraktığında hesabın dondurulacak ve platformdan çıkış yapacaksın. Hesap dondurma işlemi geri alınabilir. İstediğin zaman giriş yaparak hesabını tekrar aktifleştirebilirsin.",
      button: "Hesabımı dondur",
    },
    {
      title: "Hesabımı sil",
      image: "accound-deleted.jpg",
      content:
        "Tüm verilerini kalıcı olarak silebilirsin. Unutma, silmiş olduğun hesabına tekrar ulaşamazsın.",
      baslik: "Hesabını silmek istemene üzüldük...",
      paragraf:
        "Hesabını silersen hesabın ve hesabına bağlı verilerin kalıcı olarak kaldırılacaktır. Bu işlem geri alınamaz.",
      button: "Hesabımı sil",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleDurumDegistir = async () => {
    try {
      const kullanici = JSON.parse(
        localStorage.getItem("kullanici") || "null"
      );

      if (!kullanici?.kullanici?.id) {
        alert("Kullanıcı bilgisi bulunamadı.");
        return;
      }

      const result = await updateAccount(
        kullanici.kullanici.id,
        false
      );

      if (result.success) {
        localStorage.clear();
        router.push("/");
      } else {
        alert("Hesap durumu güncellenemedi.");
      }
    } catch (error) {
      console.error(error);
      alert("Hesap durumu güncellenemedi.");
    }
  };

  const handleHesapSil = async () => {
    try {
      const kullanici = JSON.parse(
        localStorage.getItem("kullanici") || "null"
      );

      if (!kullanici?.kullanici?.id) {
        alert("Kullanıcı bilgisi bulunamadı.");
        return;
      }

      await accountDelete(kullanici.kullanici.id);

      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Hesap silinemedi.");
    }
  };

  const handleAction = () => {
    if (openIndex === 0) {
      handleDurumDegistir();
      return;
    }

    if (openIndex === 1) {
      handleHesapSil();
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">

        <div className="mb-8">
          <span className="text-sm font-medium text-[#6B4F6D]">
            Gizlilik ve hesap
          </span>

          <h1 className="mt-2 text-2xl  tracking-tight text-gray-800 sm:text-3xl">
            Hesap ve veri yönetimi
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Hesabını geçici olarak dondurabilir veya hesabını ve
            verilerini kalıcı olarak silebilirsin.
          </p>
        </div>


        <DataAccountOptions
          items={items}
          openIndex={openIndex}
          toggle={toggle}
          handleAction={handleAction}
        />


        <div className="mt-6 rounded-2xl border border-[#E5DDE8] bg-[#FCFBFD] px-5 py-4">
          <p className="text-xs leading-5 text-gray-500">
            Hesap silme işlemi kalıcıdır ve geri alınamaz. Hesabını
            dondurma işlemi ise daha sonra tekrar giriş yaparak geri
            alınabilir.
          </p>
        </div>
      </div>
    </main>
  );
}

