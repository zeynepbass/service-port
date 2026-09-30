"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "@/shared/providers/SocketProvider";
import { markMessagesRead, patchConversation, prependMessage, upsertConversation } from "../utils/cache";

export function useMessageEvents(currentUserId) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !currentUserId) return undefined;

    function handleNewMessage({ message, conversation }) {
      prependMessage(queryClient, message.conversationId, message);
      upsertConversation(queryClient, conversation);
    }

    function handleRead({ conversationId, readerId, readAt }) {
      if (readerId === currentUserId) {
        patchConversation(queryClient, conversationId, { unreadCount: 0 });
      } else {
        markMessagesRead(queryClient, conversationId, readerId, readAt);
      }
    }

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:read", handleRead);
    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:read", handleRead);
    };
  }, [socket, currentUserId, queryClient]);
}
