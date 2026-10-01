"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getTemplate } from "@/features/category/api/category.api";
import { queryKeys } from "@/shared/api/queryKeys";
import { EmptyState, Loading } from "@/shared/components/molecules";
import { RequestExitModal } from "../components/RequestExitModal";
import { RequestSuccess } from "../components/RequestSuccess";
import { RequestWizardStep } from "../components/RequestWizardStep";
import { useChangeRequestStatus } from "../hooks/useChangeRequestStatus";
import { useRequestWizard } from "../hooks/useRequestWizard";

export default function CreateRequestPage({ slug }) {
  const router = useRouter();
  const [showExit, setShowExit] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const {
    data: template,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.template(slug),
    queryFn: () => getTemplate(slug),
  });
  const wizard = useRequestWizard(template);
  const { changeStatusAsync, pendingId } = useChangeRequestStatus();

  if (isLoading) return <Loading />;
  if (isError || !wizard.step) {
    return <EmptyState title="Bu hizmet için talep formu bulunamadı" />;
  }

  if (wizard.createdRequest) {
    const request = wizard.createdRequest;
    return (
      <RequestSuccess
        request={request}
        isCancelled={cancelled}
        isCancelling={pendingId === request.id}
        onCancel={() => changeStatusAsync(request.id, "cancelled").then(() => setCancelled(true))}
      />
    );
  }

  return (
    <div className="w-full">
      <RequestWizardStep
        categoryName={template.category.name}
        step={wizard.step}
        stepIndex={wizard.currentStep}
        totalSteps={wizard.totalSteps}
        progressPercent={wizard.progressPercent}
        form={wizard.form}
        onSubmit={wizard.submitStep}
        onBack={wizard.goBack}
        onExit={() => setShowExit(true)}
        isSubmitting={wizard.isSubmitting}
      />
      <RequestExitModal
        open={showExit}
        onClose={() => setShowExit(false)}
        onExit={() => router.push("/ana-sayfa")}
      />
    </div>
  );
}
