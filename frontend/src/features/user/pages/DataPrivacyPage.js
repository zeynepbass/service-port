"use client";

import { useState } from "react";
import { DataAccountOptions } from "../components/DataAccountOptions";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";
import { useAccountActions } from "../hooks/useAccountActions";

const ITEMS = [
  {
    key: "deactivate",
    title: "Hesabı dondur",
    image: "/9318694.jpg",
    content:
      "Verilerini kaybetmeden hesabını geçici olarak dondurabilir, istediğin zaman giriş yaparak tekrar aktifleştirebilirsin.",
    heading: "Araya mı ihtiyacın var?",
    description:
      "Hesabını devre dışı bıraktığında hesabın dondurulacak ve platformdan çıkış yapacaksın. İstediğin zaman giriş yaparak hesabını tekrar aktifleştirebilirsin.",
    button: "Hesabımı dondur",
  },
  {
    key: "delete",
    title: "Hesabımı sil",
    image: "/accound-deleted.jpg",
    content: "Tüm verilerini kalıcı olarak silebilirsin. Unutma, silmiş olduğun hesabına tekrar ulaşamazsın.",
    heading: "Hesabını silmek istemene üzüldük...",
    description:
      "Hesabını silersen hesabın ve hesabına bağlı verilerin kalıcı olarak kaldırılacaktır. Bu işlem geri alınamaz.",
    button: "Hesabımı sil",
  },
];

export default function DataPrivacyPage() {
  const [openKey, setOpenKey] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deactivate, remove, isDeactivating, isRemoving } = useAccountActions();

  function handleAction(key) {
    if (key === "deactivate") deactivate();
    if (key === "delete") setConfirmDelete(true);
  }

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <span className="text-sm font-medium text-[#6B4F6D]">Gizlilik ve hesap</span>
          <h1 className="mt-2 text-2xl tracking-tight text-gray-800 sm:text-3xl">Hesap ve veri yönetimi</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Hesabını geçici olarak dondurabilir veya hesabını ve verilerini kalıcı olarak silebilirsin.
          </p>
        </div>

        <DataAccountOptions
          items={ITEMS}
          openKey={openKey}
          onToggle={(key) => setOpenKey((current) => (current === key ? null : key))}
          onAction={handleAction}
          busyKey={isDeactivating ? "deactivate" : null}
        />

        <p className="mt-6 rounded-2xl border border-[#E5DDE8] bg-[#FCFBFD] px-5 py-4 text-xs leading-5 text-gray-500">
          Hesap silme işlemi kalıcıdır ve geri alınamaz. Hesabını dondurma işlemi ise daha sonra tekrar giriş
          yaparak geri alınabilir.
        </p>
      </div>

      <DeleteAccountDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        isDeleting={isRemoving}
      />
    </main>
  );
}
