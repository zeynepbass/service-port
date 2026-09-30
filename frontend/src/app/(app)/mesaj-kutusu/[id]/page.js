
import Chatroom from "@/feautures/feed/pages/Chatroom";

export default async function page({ params }) {
  const { id } = await params;

  return <Chatroom id={id} />;
}
