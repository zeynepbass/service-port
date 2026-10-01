import { redirect } from "next/navigation";

export default async function LegacyChatRedirect({ params }) {
  const { id } = await params;
  redirect(`/mesaj-kutusu?alici=${encodeURIComponent(id)}`);
}
