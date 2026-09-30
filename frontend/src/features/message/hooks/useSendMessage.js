"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { sendMessage } from "../api/message.api";
import { prependMessage, removeMessage, replaceMessage } from "../utils/cache";
import { messageSchema } from "../utils/schemas";

let temporaryCounter = 0;

export function useSendMessage(conversationId, currentUserId, recipientId) {
  const queryClient = useQueryClient();
  const form = useForm({ resolver: zodResolver(messageSchema), defaultValues: { text: "" } });

  const mutation = useMutation({
    mutationFn: ({ text }) => sendMessage(conversationId, text),
    onMutate: ({ text }) => {
      temporaryCounter += 1;
      const temporaryId = `temp-${temporaryCounter}`;
      prependMessage(queryClient, conversationId, {
        id: temporaryId,
        conversationId,
        senderId: currentUserId,
        recipientId,
        text,
        readAt: null,
        createdAt: new Date().toISOString(),
        pending: true,
      });
      return { temporaryId };
    },
    onSuccess: (message, variables, context) => {
      replaceMessage(queryClient, conversationId, context.temporaryId, message);
    },
    onError: (error, variables, context) => {
      removeMessage(queryClient, conversationId, context?.temporaryId);
      form.setValue("text", variables.text);
      toast.error(getErrorMessage(error, "Mesaj gönderilemedi"));
    },
  });

  const onSubmit = form.handleSubmit(({ text }) => {
    form.reset({ text: "" });
    mutation.mutate({ text: text.trim() });
  });

  return { form, onSubmit };
}
