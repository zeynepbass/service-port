"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { MessageBubble } from "../MessageBubble";

export function MessageThread({ messages, currentUserId, hasOlder, onLoadOlder, isLoadingOlder }) {
  const bottomRef = useRef(null);
  const lastId = messages.at(-1)?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: "end" });
  }, [lastId]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDE7F1] text-[#6B4F6D]">
          <MessageCircle size={28} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-sm text-[#222C31]">Henüz mesaj yok</h3>
        <p className="mt-1 text-xs text-gray-500">İlk mesajı göndererek sohbeti başlatabilirsin.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      {hasOlder && (
        <button
          type="button"
          onClick={() => onLoadOlder()}
          disabled={isLoadingOlder}
          className="mx-auto mb-4 rounded-lg px-3 py-1 text-xs text-[#6B4F6D] hover:bg-white"
        >
          {isLoadingOlder ? "Yükleniyor..." : "Önceki mesajları göster"}
        </button>
      )}
      <ol aria-label="Mesajlar" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isMine={message.senderId === currentUserId} />
        ))}
      </ol>
      <div ref={bottomRef} />
    </div>
  );
}
