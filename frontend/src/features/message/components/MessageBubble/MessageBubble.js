import { formatTime } from "@/shared/utils/format";

export function MessageBubble({ message, isMine }) {
  const status = message.pending ? "Gönderiliyor" : message.readAt ? "Okundu" : "Gönderildi";

  return (
    <li className={`mb-3 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
          isMine
            ? "rounded-br-md bg-[#6B4F6D] text-white"
            : "rounded-bl-md border border-gray-200 bg-white text-[#222C31]"
        } ${message.pending ? "opacity-70" : ""}`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.text}</p>
        <p className={`mt-1 text-[10px] ${isMine ? "text-right text-white/80" : "text-left text-gray-500"}`}>
          <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
          {isMine && <span> · {status}</span>}
        </p>
      </div>
    </li>
  );
}
