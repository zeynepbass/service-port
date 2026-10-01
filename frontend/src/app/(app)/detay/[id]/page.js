import { notFound, redirect } from "next/navigation";
import { serverGet } from "@/shared/api/server";

export default async function LegacyRequestWizardRedirect({ params }) {
  const { id } = await params;
  const { data, notFound: missing } = await serverGet(`/categories/${encodeURIComponent(id)}`);
  if (missing || !data) notFound();
  redirect(`/kategori/${data.slug}/talep-olustur`);
}
