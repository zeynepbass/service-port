import ChatPage from "@/features/message/pages/ChatPage";

export const metadata = { title: "Mesaj kutusu", robots: { index: false } };

function single(value) {
  return typeof value === "string" ? value : undefined;
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  return (
    <ChatPage
      initialConversationId={single(params.konusma)}
      recipientId={single(params.alici)}
      requestId={single(params.talep)}
    />
  );
}
