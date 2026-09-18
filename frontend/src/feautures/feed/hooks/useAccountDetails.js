
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getUserDetails } from "@/feautures/user/api/user.api";

export function useAccountDetails() {
  const router = useRouter();

  const [kullaniciAdi, setKullaniciAdi] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    setKullaniciAdi(stored);
    setUserId(stored?.id || null);
  }, []);

  const {
    data = {},
    isLoading,
  } = useQuery({
    queryKey: ["user-details", userId],
    queryFn: () => getUserDetails(userId),
    enabled: !!userId,
    select: (res) => res.data,
  });

  const handleSettings = () => {
    router.push("/hesap-bilgilerim");
  };

  return {
    data,
    kullaniciAdi,
    handleSettings,
    isLoading,
  };
}

