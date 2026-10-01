"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConversations } from "@/features/message/hooks/useConversations";
import { EmptyState, Loading } from "@/shared/components/molecules";
import { RequestAnswers } from "../components/RequestAnswers";
import { RequestContactForm } from "../components/RequestContactForm";
import { RequestConversations } from "../components/RequestConversations";
import { RequestDetails } from "../components/RequestDetails";
import { useRequestContactForm } from "../hooks/useRequestContactForm";
import { useRequestDetail } from "../hooks/useRequestDetail";

function OwnerSection({ request }) {
  const contact = useRequestContactForm(request);
  const { conversations } = useConversations();
  const related = conversations.filter((conversation) => conversation.request?.id === request.id);

  return (
    <>
      {request.status !== "cancelled" && (
        <RequestContactForm
          form={contact.form}
          onSubmit={contact.onSubmit}
          onDetectLocation={contact.detectLocation}
          onClearLocation={contact.clearLocation}
          isLocating={contact.isLocating}
          isSaving={contact.isSaving}
        />
      )}
      <RequestConversations conversations={related} />
    </>
  );
}

export default function RequestDetailPage({ id }) {
  const router = useRouter();
  const { request, isLoading, isError } = useRequestDetail(id);

  if (isLoading) return <Loading />;
  if (isError || !request) {
    return <EmptyState title="Talep bulunamadı" action={<Link href="/ana-sayfa">İşlerime dön</Link>} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Geri dön"
        className="ml-4 p-1 text-[#6B4F6D]"
      >
        <ArrowLeft size={25} aria-hidden="true" />
      </button>

      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-12">
        <h1 className="text-center text-2xl text-gray-800">{request.title}</h1>
        {request.isOwner && <OwnerSection request={request} />}
        <RequestDetails request={request} />
        <RequestAnswers answers={request.answers} />
      </div>
    </>
  );
}
