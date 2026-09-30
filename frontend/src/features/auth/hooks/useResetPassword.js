"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { resetPassword } from "../api/auth.api";
import { resetPasswordSchema } from "../utils/schemas";

export function useResetPassword(token) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (result) => {
      toast.success(result.message);
      router.push("/giris-yap");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate({ ...values, token })),
    isLoading: mutation.isPending,
  };
}
