"use client";

import { BriefcaseBusiness, MessageSquareText } from "lucide-react";
import { useSession } from "@/features/auth/hooks/useSession";
import { useCategories } from "@/features/category/hooks/useCategories";
import { useConversations } from "@/features/message/hooks/useConversations";
import { useMessageEvents } from "@/features/message/hooks/useMessageEvents";
import { AccountSummary } from "@/features/user/components/AccountSummary";
import { Sidebar } from "@/shared/components/organisms";

export function AppShell({ children }) {
  const { user } = useSession();
  const { categories } = useCategories();
  const { unreadTotal } = useConversations();
  useMessageEvents(user?.id);

  const navItems = [
    { label: "İşlerim", href: "/ana-sayfa", icon: BriefcaseBusiness },
    { label: "Mesaj Kutusu", href: "/mesaj-kutusu", icon: MessageSquareText, badge: unreadTotal },
  ];

  return (
    <div className="grid h-screen grid-cols-12 overflow-hidden">
      <div className="col-span-12 overflow-auto bg-gray-100 md:col-span-4 md:h-[50vh] lg:col-span-3 lg:h-screen">
        <Sidebar navItems={navItems} categories={categories} account={<AccountSummary />} />
      </div>
      <div className="col-span-12 flex h-full flex-col overflow-auto md:col-span-8 lg:col-span-9">
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
