"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useSession } from "@/features/auth/hooks/useSession";
import { ReviewDialog } from "@/features/review/components/ReviewDialog";
import { Loading } from "@/shared/components/molecules";
import { ChatHeader } from "../components/ChatHeader";
import { ConversationList } from "../components/ConversationList";
import { DeleteConversationDialog } from "../components/DeleteConversationDialog";
import { MessageComposer } from "../components/MessageComposer";
import { MessageThread } from "../components/MessageThread";
import { useConversations } from "../hooks/useConversations";
import { useHideConversation } from "../hooks/useHideConversation";
import { useMarkConversationRead } from "../hooks/useMarkConversationRead";
import { useMessages } from "../hooks/useMessages";
import { useOpenConversation } from "../hooks/useOpenConversation";
import { useSendMessage } from "../hooks/useSendMessage";

export default function ChatPage({ initialConversationId, recipientId, requestId }) {
  const router = useRouter();
  const { user } = useSession();
  const { conversations, isLoading } = useConversations();
  const [selectedId, setSelectedId] = useState(initialConversationId ?? null);
  const [dialog, setDialog] = useState(null);

  const selectConversation = useCallback(
    (id) => {
      setSelectedId(id);
      router.replace(id ? `/mesaj-kutusu?konusma=${id}` : "/mesaj-kutusu", { scroll: false });
    },
    [router],
  );

  const { isOpening } = useOpenConversation({
    recipientId: recipientId && recipientId !== user?.id ? recipientId : null,
    requestId,
    onOpened: selectConversation,
  });

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? null;
  const messages = useMessages(selected?.id);
  const composer = useSendMessage(selected?.id, user?.id, selected?.otherUser?.id);
  const { hide, isHiding } = useHideConversation(() => {
    setDialog(null);
    selectConversation(null);
  });
  useMarkConversationRead(selected);

  if (isLoading || isOpening) {
    return <Loading />;
  }

  return (
    <div className="flex h-[90vh] flex-col overflow-hidden bg-[#F7F7F9] md:flex-row">
      <ConversationList conversations={conversations} selectedId={selectedId} onSelect={selectConversation} />

      <section aria-label="Sohbet" className="flex min-w-0 flex-1 flex-col bg-[#FCFBFD]">
        <ChatHeader
          conversation={selected}
          onReview={() => setDialog("review")}
          onDelete={() => setDialog("delete")}
        />
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {selected && (
            <MessageThread
              messages={messages.messages}
              currentUserId={user?.id}
              hasOlder={messages.hasOlder}
              onLoadOlder={messages.loadOlder}
              isLoadingOlder={messages.isLoadingOlder}
            />
          )}
        </div>
        {selected && <MessageComposer form={composer.form} onSubmit={composer.onSubmit} />}
      </section>

      {selected && (
        <>
          <ReviewDialog
            open={dialog === "review"}
            onClose={() => setDialog(null)}
            targetId={selected.otherUser?.id}
            requestId={selected.request?.id}
          />
          <DeleteConversationDialog
            open={dialog === "delete"}
            onClose={() => setDialog(null)}
            onConfirm={() => hide(selected.id)}
            isDeleting={isHiding}
          />
        </>
      )}
    </div>
  );
}
