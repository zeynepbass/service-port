"use client";

import { Controller } from "react-hook-form";
import { Button, Textarea } from "@/shared/components/atoms";
import { Modal, StarRating } from "@/shared/components/molecules";
import { useCreateReview } from "../../hooks/useCreateReview";

export function ReviewDialog({ open, onClose, targetId, requestId }) {
  const { form, onSubmit, isSubmitting } = useCreateReview({ targetId, requestId, onSuccess: onClose });
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;
  const rating = watch("rating");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hizmeti Değerlendir"
      description="Aldığın hizmet hakkında değerlendirme yapabilirsin."
    >
      <form onSubmit={onSubmit} noValidate>
        <div className="rounded-2xl bg-[#FCFBFD] p-5 text-center">
          <p className="mb-3 text-sm font-medium text-[#222C31]">Hizmetten memnun kaldın mı?</p>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />}
          />
          <p className="mt-2 text-xs text-gray-500" aria-live="polite">
            {rating === 0 ? "Puan vermek için yıldız seç" : `${rating} / 5 puan`}
          </p>
          {errors.rating && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-[#222C31]">
            Yorum <span className="ml-1 font-normal text-gray-500">(opsiyonel)</span>
          </label>
          <Textarea
            id="review-comment"
            rows={4}
            placeholder="İstersen deneyimini paylaşabilirsin..."
            aria-invalid={Boolean(errors.comment)}
            {...register("comment")}
          />
          {errors.comment && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.comment.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-5">
          {isSubmitting ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
        </Button>
      </form>
    </Modal>
  );
}
