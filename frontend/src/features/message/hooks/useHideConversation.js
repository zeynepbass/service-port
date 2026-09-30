"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { hideConversation } from "../api/message.api";
import { removeConversation } from "../utils/cache";

export function useHideConversation(onHidden) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: hideConversation,
    onSuccess: (result, conversationId) => {
      removeConversation(queryClient, conversationId);
      toast.success("Sohbet senin için silindi");
      onHidden?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Sohbet silinemedi")),
  });

  return { hide: mutation.mutate, isHiding: mutation.isPending };
}
