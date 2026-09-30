import { MessageCircle } from "lucide-react";
import { ConversationListItem } from "../ConversationListItem";

export function ConversationList({ conversations, selectedId, onSelect }) {
  return (
    <aside aria-label="Konuşmalar" className="w-full shrink-0 border-r border-gray-200 bg-white md:w-[280px]">
      <div className="border-b border-gray-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7F1] text-[#6B4F6D]">
            <MessageCircle size={21} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm text-[#222C31]">Mesajlar</h1>
            <p className="text-xs text-gray-500">{conversations.length} konuşma</p>
          </div>
        </div>
      </div>

      <div className="h-[calc(90vh-81px)] overflow-y-auto p-3">
        {conversations.length > 0 ? (
          <ul>
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center text-center text-gray-400">
            <MessageCircle size={32} aria-hidden="true" />
            <p className="mt-3 text-sm text-gray-500">Henüz konuşma yok</p>
          </div>
        )}
      </div>
    </aside>
  );
}
