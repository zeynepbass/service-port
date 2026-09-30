"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";
import { safeRedirectPath } from "@/shared/utils/validation";
import { login } from "../api/auth.api";
import { loginSchema } from "../utils/schemas";

export function useLogin(nextPath) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.session, user);
      toast.success("Giriş başarılı!");
      router.replace(safeRedirectPath(nextPath));
      router.refresh();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Giriş yapılamadı"));
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isLoading: mutation.isPending,
  };
}
