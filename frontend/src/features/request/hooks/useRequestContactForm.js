
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  updateActive,
  getActiveRenovations,
  getConversations,
} from "../api/post.api";
import {  getUsers} from "@/feautures/user/api/user.api"

export function useService (paramsId) {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [sure, setSure] = useState(null);
  const [promptPhone, setPromptPhone] = useState(false);
  const [storedUser, setStoredUser] = useState(null);

  const id = paramsId;


  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("kullanici") || "{}"
    );

    setStoredUser(user);
  }, []);


  const {
    data: storedData,
    isLoading: isServiceLoading,
  } = useQuery({
    queryKey: ["active-renovation", id],
    queryFn: () => getActiveRenovations(id),
    enabled: !!id,
  });


  const {
    data: users = [],
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });


  const {
    data: chat = [],
    isLoading: isChatLoading,
  } = useQuery({
    queryKey: ["conversations", storedUser?.id],
    queryFn: () => getConversations(storedUser.id),
    enabled: !!storedUser?.id,
  });


  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) =>
      updateActive(id, formData),

    onSuccess: () => {
      setLocation("");
      setPhone("");
      setPromptPhone(false);
      setSure(null);
    },

    onError: (error) => {
      console.error("İlan güncellenemedi:", error);
    },
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Tarayıcı konumu desteklemiyor!");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(
        `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`
      );
    });
  };

  const handleGetPhone = () => {
    setPromptPhone((prev) => !prev);
  };

  const handleGetCalendar = () => {
    setSure((prev) => (prev ? null : new Date()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      konum: location,
      telefonNo: phone,
      bitisTarihi: sure ? sure.toISOString() : null,
    };

    updateMutation.mutate({
      id,
      formData,
    });
  };

  const handleBack = () => {
    router.back();
  };

  const filteredData = users.filter((userItem) =>
    chat.some(
      (chatItem) =>
        chatItem.gonderenId === userItem._id
    )
  );

  return {
    storedData,
    filteredData,

    location,
    phone,
    sure,
    promptPhone,

    setPhone,
    setSure,

    handleGetLocation,
    handleGetPhone,
    handleGetCalendar,
    handleSubmit,
    handleBack,

    isLoading:
      isServiceLoading ||
      isUsersLoading ||
      isChatLoading,

    isUpdating: updateMutation.isPending,
  };
};

