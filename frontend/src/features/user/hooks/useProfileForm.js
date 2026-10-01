"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";
import { updateProfile } from "../api/user.api";
import { profileSchema, validateAvatar } from "../utils/schemas";

function defaultsFrom(user) {
  return {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  };
}

export function useProfileForm(user) {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const form = useForm({ resolver: zodResolver(profileSchema), values: defaultsFrom(user) });

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.session, updated);
      setAvatarFile(null);
      setPreview(null);
      toast.success("Bilgiler başarıyla güncellendi!");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Güncelleme başarısız")),
  });

  function selectAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validateAvatar(file);
    setAvatarError(error);
    if (error) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  const onSubmit = form.handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value ?? ""));
    if (avatarFile) formData.append("avatar", avatarFile);
    mutation.mutate(formData);
  });

  return {
    form,
    onSubmit,
    selectAvatar,
    avatarSrc: preview ?? user?.avatar ?? null,
    avatarError,
    isSaving: mutation.isPending,
  };
}
