export const queryKeys = {
  session: ["session"],
  categories: ["categories"],
  category: (slug) => ["categories", slug],
  template: (slug) => ["categories", slug, "template"],
  requests: (filters) => ["requests", filters],
  requestsRoot: ["requests"],
  request: (id) => ["request", id],
  conversations: ["conversations"],
  conversation: (id) => ["conversation", id],
  messages: (conversationId) => ["messages", conversationId],
  user: (id) => ["user", id],
  reviews: (userId) => ["reviews", userId],
};
