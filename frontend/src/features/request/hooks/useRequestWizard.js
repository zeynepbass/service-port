"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";
import { createRequest } from "../api/request.api";
import { stepSchema } from "../utils/schemas";

export function useRequestWizard(template) {
  const queryClient = useQueryClient();
  const steps = useMemo(() => template?.steps ?? [], [template]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const step = steps[currentStep];
  const stepRef = useRef(step);
  stepRef.current = step;

  const form = useForm({
    resolver: (values, context, options) =>
      zodResolver(stepSchema(stepRef.current?.options ?? []))(values, context, options),
    defaultValues: { selected: "" },
  });

  const createMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: (request) => {
      queryClient.setQueryData(queryKeys.request(request.id), request);
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsRoot });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Talep oluşturulamadı")),
  });

  function goTo(index, nextAnswers) {
    setCurrentStep(index);
    form.reset({ selected: nextAnswers[index]?.selected ?? "" });
  }

  const submitStep = form.handleSubmit(({ selected }) => {
    const nextAnswers = [...answers];
    nextAnswers[currentStep] = { question: step.question, selected };
    setAnswers(nextAnswers);

    if (currentStep < steps.length - 1) {
      goTo(currentStep + 1, nextAnswers);
      return;
    }

    createMutation.mutate({ categoryId: template.category.id, answers: nextAnswers });
  });

  function goBack() {
    if (currentStep > 0) goTo(currentStep - 1, answers);
  }

  return {
    form,
    step,
    currentStep,
    totalSteps: steps.length,
    progressPercent: steps.length ? ((currentStep + 1) / steps.length) * 100 : 0,
    submitStep,
    goBack,
    createdRequest: createMutation.data ?? null,
    isSubmitting: createMutation.isPending,
  };
}
