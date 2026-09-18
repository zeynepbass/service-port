
import Request from "@/feautures/feed/pages/Request"
export default async function page({ params }) {
  const { id } = await params;
  return <Request id={id}/>
}

