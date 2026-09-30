import { queryKeys } from "@/shared/api/queryKeys";

export function upsertConversation(queryClient, conversation) {
  queryClient.setQueryData(queryKeys.conversations, (current) => {
    if (!current) return [conversation];
    return [conversation, ...current.filter((item) => item.id !== conversation.id)];
  });
}

export function patchConversation(queryClient, conversationId, patch) {
  queryClient.setQueryData(queryKeys.conversations, (current) =>
    current?.map((item) => (item.id === conversationId ? { ...item, ...patch } : item)),
  );
}

export function removeConversation(queryClient, conversationId) {
  queryClient.setQueryData(queryKeys.conversations, (current) =>
    current?.filter((item) => item.id !== conversationId),
  );
  queryClient.removeQueries({ queryKey: queryKeys.messages(conversationId) });
}

function mapPages(data, mapItems) {
  if (!data) return data;
  return { ...data, pages: data.pages.map((page, index) => ({ ...page, items: mapItems(page.items, index) })) };
}

export function prependMessage(queryClient, conversationId, message) {
  queryClient.setQueryData(queryKeys.messages(conversationId), (data) => {
    if (!data) return data;
    const exists = data.pages.some((page) => page.items.some((item) => item.id === message.id));
    if (exists) return data;
    return mapPages(data, (items, index) => (index === 0 ? [message, ...items] : items));
  });
}

export function replaceMessage(queryClient, conversationId, temporaryId, message) {
  queryClient.setQueryData(queryKeys.messages(conversationId), (data) => {
    if (!data) return data;
    const alreadyDelivered = data.pages.some((page) => page.items.some((item) => item.id === message.id));
    return mapPages(data, (items) =>
      alreadyDelivered
        ? items.filter((item) => item.id !== temporaryId)
        : items.map((item) => (item.id === temporaryId ? message : item)),
    );
  });
}

export function removeMessage(queryClient, conversationId, messageId) {
  queryClient.setQueryData(queryKeys.messages(conversationId), (data) =>
    mapPages(data, (items) => items.filter((item) => item.id !== messageId)),
  );
}

export function markMessagesRead(queryClient, conversationId, readerId, readAt) {
  queryClient.setQueryData(queryKeys.messages(conversationId), (data) =>
    mapPages(data, (items) =>
      items.map((item) => (item.recipientId === readerId && !item.readAt ? { ...item, readAt } : item)),
    ),
  );
}
