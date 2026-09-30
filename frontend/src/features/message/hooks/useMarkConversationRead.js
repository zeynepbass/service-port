"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { markConversationRead } from "../api/message.api";
import { patchConversation } from "../utils/cache";

export function useMarkConversationRead(conversation) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: markConversationRead,
    onMutate: (conversationId) => patchConversation(queryClient, conversationId, { unreadCount: 0 }),
  });

  const conversationId = conversation?.id;
  const unreadCount = conversation?.unreadCount ?? 0;

  useEffect(() => {
    if (conversationId && unreadCount > 0) {
      mutate(conversationId);
    }
  }, [conversationId, unreadCount, mutate]);
}
