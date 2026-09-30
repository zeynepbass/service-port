"use client";

import { Button } from "@/shared/components/atoms";

export function MessageComposer({ form, onSubmit, disabled }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-4xl items-start gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="message-text" className="sr-only">
            Mesaj
          </label>
          <input
            id="message-text"
            type="text"
            autoComplete="off"
            placeholder="Mesajınızı yazın..."
            disabled={disabled}
            aria-invalid={Boolean(errors.text)}
            aria-describedby={errors.text ? "message-text-error" : undefined}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 text-sm text-[#222C31] outline-none transition focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]"
            {...register("text")}
          />
          {errors.text && (
            <p id="message-text-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.text.message}
            </p>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={disabled} className="h-11 w-auto min-w-[110px] px-5">
          Gönder
        </Button>
      </form>
    </div>
  );
}
