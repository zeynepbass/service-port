"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { listConversations } from "../api/message.api";

export function useConversations() {
  const query = useQuery({ queryKey: queryKeys.conversations, queryFn: listConversations });
  const conversations = query.data ?? [];

  return {
    conversations,
    unreadTotal: conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
    isLoading: query.isLoading,
  };
}
