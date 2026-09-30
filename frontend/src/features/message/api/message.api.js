import { apiClient, unwrap, unwrapPage } from "@/shared/api/client";

const BASE = "/messages/conversations";

export async function listConversations() {
  return unwrap(await apiClient.get(BASE));
}

export async function openConversation(values) {
  return unwrap(await apiClient.post(BASE, values));
}

export async function listMessages(conversationId, cursor) {
  return unwrapPage(await apiClient.get(`${BASE}/${conversationId}/messages`, { params: { cursor, limit: 30 } }));
}

export async function sendMessage(conversationId, text) {
  return unwrap(await apiClient.post(`${BASE}/${conversationId}/messages`, { text }));
}

export async function markConversationRead(conversationId) {
  return unwrap(await apiClient.post(`${BASE}/${conversationId}/read`));
}

export async function hideConversation(conversationId) {
  await apiClient.delete(`${BASE}/${conversationId}`);
}
