"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";
import { createReview } from "../api/review.api";
import { reviewSchema } from "../utils/schemas";

export function useCreateReview({ targetId, requestId, onSuccess }) {
  const queryClient = useQueryClient();
  const form = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, comment: "" } });

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(targetId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(targetId) });
      toast.success("Değerlendirme başarıyla kaydedildi!");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Değerlendirme kaydedilemedi")),
  });

  const onSubmit = form.handleSubmit(({ rating, comment }) =>
    mutation.mutate({ targetId, requestId: requestId ?? null, rating, comment: comment || null }),
  );

  return { form, onSubmit, isSubmitting: mutation.isPending };
}
