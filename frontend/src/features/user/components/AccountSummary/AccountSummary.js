"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/hooks/useSession";
import { Avatar } from "@/shared/components/atoms";
import { fullName, initials } from "@/shared/utils/format";

export function AccountSummary() {
  const { user } = useSession();

  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-[#E5E5E7] bg-[#F7F7F9] px-3 py-2.5">
      <Avatar src={user?.avatar} name={fullName(user)} fallback={initials(user)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-gray-700">{fullName(user)}</span>
        <span className="truncate text-[11px] text-gray-500">{user?.email}</span>
        <Link
          href="/hesap-bilgilerim"
          className="mt-1 w-fit text-sm font-medium text-[#6B4F6D] transition hover:text-[#4E244D]"
        >
          Ayarlar
        </Link>
      </div>
    </div>
  );
}
