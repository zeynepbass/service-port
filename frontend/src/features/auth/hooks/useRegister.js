"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { register } from "../api/auth.api";
import { registerSchema } from "../utils/schemas";

export function useRegister() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Kayıt başarılı! Şimdi giriş yapabilirsin.");
      router.push("/giris-yap");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kayıt oluşturulamadı"));
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isLoading: mutation.isPending,
  };
}
