"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { openConversation } from "../api/message.api";
import { upsertConversation } from "../utils/cache";

export function useOpenConversation({ recipientId, requestId, onOpened }) {
  const queryClient = useQueryClient();
  const startedFor = useRef(null);
  const onOpenedRef = useRef(onOpened);

  useEffect(() => {
    onOpenedRef.current = onOpened;
  }, [onOpened]);

  const { mutate, isPending } = useMutation({
    mutationFn: openConversation,
    onSuccess: (conversation) => {
      upsertConversation(queryClient, conversation);
      onOpenedRef.current?.(conversation.id);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Konuşma başlatılamadı")),
  });

  useEffect(() => {
    if (!recipientId || startedFor.current === recipientId) return;
    startedFor.current = recipientId;
    mutate({ recipientId, requestId: requestId || null });
  }, [recipientId, requestId, mutate]);

  return { isOpening: isPending };
}
