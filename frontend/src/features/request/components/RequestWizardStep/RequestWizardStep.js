
"use client";

import { Button, Input } from "@/shared/components/atoms";

export function RequestForm({
  item,
  steps,
  currentStep,
  answers,
  progressPercent,
  handleAnswer,
  handleNext,
  handleBack,
  setShowExitModal,
}) {
  const currentQuestion = steps[currentStep];

  return (
    <div className="mx-auto mt-12 min-h-[80vh] w-[90%] max-w-3xl md:mt-20">


      <div className="mb-8 text-center">
        <span className="text-sm font-medium text-[#6B4F6D]">
          Hizmet Talebi
        </span>

        <h2 className="mt-2 text-2xl  tracking-tight text-[#222C31]">
          {item.isim}
        </h2>
      </div>


      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">
            İlerleme
          </span>

          <span className="text-xs font-medium text-[#6B4F6D]">
            %{Math.round(progressPercent)}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#EDE7F1]">
          <div
            className="h-full rounded-full bg-[#6B4F6D] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>


      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#6B4F6D]">
            Soru {currentStep + 1}
          </span>

          <h3 className="mt-2 text-lg  leading-7 text-[#222C31]">
            {currentQuestion?.baslik.baslik}
          </h3>
        </div>

     
        <div className="space-y-3">
          {currentQuestion?.secenekler.map((option) => {
            const isSelected =
              answers[currentStep]?.secilen === option;

            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                  isSelected
                    ? "border-[#C9B7CE] bg-[#EDE7F1] text-[#4E244D]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#DCD0E3] hover:bg-[#FCFBFD]"
                }`}
              >
                <Input
                  type="radio"
                  name={`step-${currentStep}`}
                  checked={isSelected}
                  onChange={() => handleAnswer(option)}
                  className="h-4 w-4 accent-[#6B4F6D]"
                />

                <span className="text-sm font-medium">
                  {option}
                </span>
              </label>
            );
          })}
        </div>


        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">

          <Button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-[#DCD0E3] hover:bg-[#F7F7F9] hover:text-[#4E244D]"
          >
            Çık
          </Button>

          <div className="flex items-center gap-3">

            {currentStep > 0 && (
              <Button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-[#DCD0E3] hover:bg-[#F7F7F9] hover:text-[#4E244D]"
              >
                Geri
              </Button>
            )}

            <Button
              type="button"
              onClick={handleNext}
              disabled={!answers[currentStep]}
              className="rounded-xl bg-[#6B4F6D] px-6 py-2.5 text-sm  text-white shadow-sm transition-all duration-200 hover:bg-[#4E244D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Devam
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
