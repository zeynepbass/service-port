import { Avatar } from "@/shared/components/atoms";
import { fullName, initials } from "@/shared/utils/format";

export function ConversationListItem({ conversation, selected, onSelect }) {
  const name = fullName(conversation.otherUser);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        aria-current={selected ? "true" : undefined}
        className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
          selected ? "bg-[#EDE7F1] text-[#4E244D]" : "text-[#222C31] hover:bg-[#F7F7F9]"
        }`}
      >
        <Avatar src={conversation.otherUser?.avatar} name={name} fallback={initials(conversation.otherUser)} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="mt-0.5 block truncate text-xs text-gray-500">
            {conversation.request?.title ?? conversation.lastMessage?.text ?? "Mesajlaşma"}
          </span>
        </span>
        {conversation.unreadCount > 0 && (
          <span className="rounded-full bg-[#6B4F6D] px-2 py-0.5 text-xs text-white">
            {conversation.unreadCount}
            <span className="sr-only"> okunmamış mesaj</span>
          </span>
        )}
      </button>
    </li>
  );
}
