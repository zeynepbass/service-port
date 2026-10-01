"use client";

import { Button } from "@/shared/components/atoms";

export function RequestWizardStep({
  categoryName,
  step,
  stepIndex,
  totalSteps,
  progressPercent,
  form,
  onSubmit,
  onBack,
  onExit,
  isSubmitting,
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const selected = watch("selected");
  const isLast = stepIndex === totalSteps - 1;
  const errorId = "wizard-step-error";

  return (
    <div className="mx-auto mt-12 min-h-[80vh] w-[90%] max-w-3xl md:mt-20">
      <div className="mb-8 text-center">
        <span className="text-sm font-medium text-[#6B4F6D]">Hizmet Talebi</span>
        <h1 className="mt-2 text-2xl tracking-tight text-[#222C31]">{categoryName}</h1>
      </div>

      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between text-xs font-medium">
          <span className="text-gray-500">İlerleme</span>
          <span className="text-[#6B4F6D]">%{Math.round(progressPercent)}</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-[#EDE7F1]"
          role="progressbar"
          aria-label="Talep ilerlemesi"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercent)}
        >
          <div
            className="h-full rounded-full bg-[#6B4F6D] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
      >
        <fieldset aria-describedby={errors.selected ? errorId : undefined}>
          <legend className="mb-6">
            <span className="block text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
              Soru {stepIndex + 1} / {totalSteps}
            </span>
            <span className="mt-2 block text-lg leading-7 text-[#222C31]">{step.question}</span>
          </legend>

          <div className="space-y-3">
            {step.options.map((option) => {
              const isSelected = selected === option;
              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#C9B7CE] ${
                    isSelected
                      ? "border-[#C9B7CE] bg-[#EDE7F1] text-[#4E244D]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#DCD0E3] hover:bg-[#FCFBFD]"
                  }`}
                >
                  <input
                    type="radio"
                    value={option}
                    className="h-4 w-4 accent-[#6B4F6D]"
                    {...register("selected")}
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              );
            })}
          </div>
          {errors.selected && (
            <p id={errorId} role="alert" className="mt-3 text-sm text-red-600">
              {errors.selected.message}
            </p>
          )}
        </fieldset>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <Button onClick={onExit} variant="outline" className="w-auto px-5">
            Çık
          </Button>
          <div className="flex items-center gap-3">
            {stepIndex > 0 && (
              <Button onClick={onBack} variant="outline" className="w-auto px-5">
                Geri
              </Button>
            )}
            <Button type="submit" variant="primary" className="w-auto px-6" disabled={isSubmitting}>
              {isLast ? (isSubmitting ? "Gönderiliyor..." : "Talebi Gönder") : "Devam"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
