"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { requestPasswordReset } from "../api/auth.api";
import { forgotPasswordSchema } from "../utils/schemas";

export function useForgotPassword() {
  const form = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isLoading: mutation.isPending,
    message: mutation.data?.message ?? null,
  };
}
