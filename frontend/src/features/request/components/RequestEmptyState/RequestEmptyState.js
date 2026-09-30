import Link from "next/link";
import { EmptyState } from "@/shared/components/molecules";

export function RequestEmptyState({ tab }) {
  return (
    <EmptyState
      image={tab.image}
      description={tab.emptyText}
      action={
        tab.key === "active" ? (
          <Link href="#trend-hizmetler" className="text-[#222C31] underline">
            Hizmetlere göz at
          </Link>
        ) : null
      }
    />
  );
}
