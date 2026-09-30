import Link from "next/link";
import { Avatar } from "@/shared/components/atoms";
import { fullName, initials } from "@/shared/utils/format";

export function RequestConversations({ conversations }) {
  return (
    <section aria-labelledby="request-conversations-title" className="mt-6 text-left">
      <h2 id="request-conversations-title" className="text-xl text-gray-600">
        Mesajlar
      </h2>
      {conversations.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">Bu talep için henüz mesaj yok.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-3">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/mesaj-kutusu?konusma=${conversation.id}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:border-[#DCD0E3]"
              >
                <Avatar
                  src={conversation.otherUser?.avatar}
                  name={fullName(conversation.otherUser)}
                  fallback={initials(conversation.otherUser)}
                />
                <span>
                  <span className="block text-sm text-gray-800">{fullName(conversation.otherUser)}</span>
                  {conversation.lastMessage && (
                    <span className="block max-w-[200px] truncate text-xs text-gray-500">
                      {conversation.lastMessage.text}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
