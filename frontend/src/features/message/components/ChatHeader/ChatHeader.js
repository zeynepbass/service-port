import { Star, Trash2 } from "lucide-react";
import { Avatar } from "@/shared/components/atoms";
import { fullName, initials } from "@/shared/utils/format";

export function ChatHeader({ conversation, onReview, onDelete }) {
  if (!conversation) {
    return (
      <header className="flex h-[72px] shrink-0 items-center border-b border-gray-200 bg-white px-6">
        <div>
          <h2 className="text-sm text-[#222C31]">Mesajlar</h2>
          <p className="text-xs text-gray-500">Mesajlaşmaya başlamak için bir konuşma seçin</p>
        </div>
      </header>
    );
  }

  const name = fullName(conversation.otherUser);

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <Avatar
          src={conversation.otherUser?.avatar}
          name={name}
          fallback={initials(conversation.otherUser)}
        />
        <div>
          <h2 className="text-sm text-[#222C31]">{name}</h2>
          <p className="text-xs text-gray-500">{conversation.request?.title ?? "Mesajlaşma"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReview}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#6B4F6D] hover:bg-[#F7F7F9]"
        >
          <Star size={16} aria-hidden="true" />
          Değerlendir
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} aria-hidden="true" />
          Sohbeti sil
        </button>
      </div>
    </header>
  );
}
