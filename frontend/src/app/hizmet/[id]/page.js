
import Service from "@/feautures/feed/pages/Service";

export default async function page({ params })  {
  const { id } = await params;
  return<Service paramsId={id} />

};

