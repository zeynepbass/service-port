
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getRenovationById,
  createActiveRenovation,
  updateStatus,
} from "../api/post.api";

export function useRequest(id)  {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [dialog, setOpenDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showRequestExitModal, setShowRequestExitModal] = useState(false);

  const [stored, setKullanici] = useState(null);
  const [storedData, setStoredItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tadilat", id],
    queryFn: () => getRenovationById(id),
    enabled: !!id,
  });

  const steps = data?.[0]?.adimlar ?? [];
  const item = data?.[0]?.kategori ?? "";

  useEffect(() => {
    const kullanici = JSON.parse(
      localStorage.getItem("kullanici")
    );

    const storedItem = localStorage.getItem("item");

    setKullanici(kullanici);
    setStoredItem(storedItem);
  }, []);

  const createMutation = useMutation({
    mutationFn: createActiveRenovation,

    onSuccess: (response) => {
      localStorage.setItem("item", response.primaryKey);
      localStorage.setItem("itemDurum", response._id);

      setOpen(true);
    },

    onError: (error) => {
      console.error(
        "Post işlemi başarısız:",
        error
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, forceIptal }) =>
      updateStatus(id, null, forceIptal),

    onSuccess: () => {
      setOpenDialog(true);
    },

    onError: (error) => {
      console.error(
        "Durum güncellenemedi:",
        error
      );
    },
  });

  const handleAnswer = (option) => {
    setAnswers((prev) => {
      const updated = [...prev];

      updated[currentStep] = {
        kategoriIsim: steps[currentStep].baslik,
        secenekler: steps[currentStep].secenekler,
        secilen: option,
      };

      return updated;
    });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const dataToSend = {
      primaryKey: id,
      anaBaslik: item.isim,
      durum: "aktif",

      ad: stored?.ad,
      soyad: stored?.soyad,
      email: stored?.email,
      kullaniciId: stored?.id,

      veriler: answers.map((ans) => ({
        kategoriIsim: ans.kategoriIsim,
        secenekler: ans.secenekler,
        secilen: ans.secilen,
      })),

      telefonNo: stored?.telefonNo || null,
      konum: stored?.konum || null,
    };

    createMutation.mutate(dataToSend);
  };

  const handleClick = () => {
    const durumId = localStorage.getItem("itemDurum");

    updateMutation.mutate({
      id: durumId,
      forceIptal: true,
    });
  };

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDialog(false);
    router.push("/ana-sayfa");
  };

  const handleExit = () => {
    setShowRequestExitModal(false);
    router.push("/ana-sayfa");
  };

  const progressPercent = steps.length
    ? ((currentStep + 1) / steps.length) * 100
    : 0;

  return {
    open,
    dialog,
    currentStep,
    answers,
    showRequestExitModal,

    steps,
    item,
    storedData,

    progressPercent,

    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,

    handleAnswer,
    handleBack,
    handleNext,
    handleClick,
    handleClose,
    handleExit,

    setShowRequestExitModal,
  };
};

