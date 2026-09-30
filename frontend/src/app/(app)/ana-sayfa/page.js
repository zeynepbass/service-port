
import { getActiveRenovations } from "@/feautures/feed/api/post.api";
import Home from "@/feautures/feed/pages/Home";

export const dynamic = "force-dynamic";

export default async function page() {
  let itemsAktif = [];

  try {
    itemsAktif = await getActiveRenovations();
  } catch (error) {
    console.error("Aktif tadilatlar alınamadı:", error);
  }

  return <Home itemsAktif={itemsAktif} />;
};


