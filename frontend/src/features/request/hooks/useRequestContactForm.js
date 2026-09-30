"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";
import { toDateInputValue } from "@/shared/utils/format";
import { updateRequest } from "../api/request.api";
import { contactSchema, toContactPayload } from "../utils/schemas";

function defaultsFrom(request) {
  return {
    phone: request?.contact?.phone ?? "",
    endsAt: toDateInputValue(request?.endsAt),
    location: request?.location ?? null,
  };
}

export function useRequestContactForm(request) {
  const queryClient = useQueryClient();
  const [isLocating, setIsLocating] = useState(false);
  const form = useForm({ resolver: zodResolver(contactSchema), values: defaultsFrom(request) });

  const mutation = useMutation({
    mutationFn: (payload) => updateRequest(request.id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.request(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsRoot });
      toast.success("Talep bilgileri kaydedildi");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Talep güncellenemedi")),
  });

  function detectLocation() {
    if (!navigator.geolocation) {
      toast.error("Tarayıcın konum özelliğini desteklemiyor");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        form.setValue("location", { lat: coords.latitude, lng: coords.longitude }, { shouldDirty: true });
        setIsLocating(false);
      },
      () => {
        toast.error("Konum alınamadı");
        setIsLocating(false);
      },
    );
  }

  const onSubmit = form.handleSubmit((values) => {
    const payload = toContactPayload(values, form.formState.dirtyFields);
    if (Object.keys(payload).length === 0) {
      toast.info("Değişiklik yapılmadı");
      return;
    }
    mutation.mutate(payload);
  });

  return {
    form,
    onSubmit,
    detectLocation,
    clearLocation: () => form.setValue("location", null, { shouldDirty: true }),
    isLocating,
    isSaving: mutation.isPending,
  };
}
