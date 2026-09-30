function idOf(value) {
  if (!value) return null;
  return (value._id ?? value).toString();
}

function isPopulated(value) {
  return Boolean(value && typeof value === "object" && value.firstName !== undefined);
}

export function avatarUrl(avatar) {
  if (!avatar) return null;
  return /^https?:\/\//.test(avatar) ? avatar : `/uploads/${avatar}`;
}

export function serializePublicUser(user) {
  if (!isPopulated(user)) {
    return user ? { id: idOf(user), firstName: "Silinmiş", lastName: "Kullanıcı", avatar: null } : null;
  }
  return {
    id: idOf(user),
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: avatarUrl(user.avatar),
    ratingAverage: user.ratingAverage ?? 0,
    ratingCount: user.ratingCount ?? 0,
  };
}

export function serializePrivateUser(user) {
  return {
    ...serializePublicUser(user),
    email: user.email,
    phone: user.phone ?? null,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export function serializeCategory(category) {
  return {
    id: idOf(category),
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    image: category.image ?? null,
  };
}

export function serializeTemplate(template) {
  return {
    id: idOf(template),
    categoryId: idOf(template.category),
    steps: template.steps.map((step) => ({ question: step.question, options: [...step.options] })),
  };
}

export function effectiveStatus(request, now = new Date()) {
  if (request.status === "active" && request.endsAt && request.endsAt < now) {
    return "passive";
  }
  return request.status;
}

function serializeLocation(location) {
  if (!location?.coordinates) return null;
  const [lng, lat] = location.coordinates;
  return { lat, lng };
}

export function serializeRequest(request, { viewerId, includeContact = false } = {}) {
  const ownerId = idOf(request.owner);
  const category = request.category && request.category.name !== undefined ? request.category : null;

  return {
    id: idOf(request),
    title: request.title,
    category: category
      ? { id: idOf(category), name: category.name, slug: category.slug }
      : { id: idOf(request.category) },
    owner: serializePublicUser(request.owner),
    answers: request.answers.map((answer) => ({
      question: answer.question,
      options: [...answer.options],
      selected: answer.selected,
    })),
    status: effectiveStatus(request),
    isExpired: effectiveStatus(request) !== request.status,
    location: serializeLocation(request.location),
    startsAt: request.startsAt,
    endsAt: request.endsAt,
    createdAt: request.createdAt,
    isOwner: viewerId ? ownerId === viewerId.toString() : false,
    contact: includeContact
      ? { phone: request.phone ?? null, email: request.owner?.email ?? null }
      : null,
  };
}

export function serializeMessage(message) {
  return {
    id: idOf(message),
    conversationId: idOf(message.conversation),
    senderId: idOf(message.sender),
    recipientId: idOf(message.recipient),
    text: message.text,
    readAt: message.readAt,
    createdAt: message.createdAt,
  };
}

export function serializeConversation(conversation, viewerId) {
  const viewer = viewerId.toString();
  const state = conversation.states.find((entry) => idOf(entry.user) === viewer);
  const otherUser = conversation.participants.find((participant) => idOf(participant) !== viewer);
  const lastMessage = conversation.lastMessage;
  const lastMessageVisible =
    lastMessage?.createdAt && (!state?.clearedAt || lastMessage.createdAt > state.clearedAt);
  const request = conversation.request && conversation.request.title !== undefined ? conversation.request : null;

  return {
    id: idOf(conversation),
    otherUser: serializePublicUser(otherUser),
    request: request ? { id: idOf(request), title: request.title } : null,
    lastMessage: lastMessageVisible
      ? { text: lastMessage.text, senderId: idOf(lastMessage.sender), createdAt: lastMessage.createdAt }
      : null,
    unreadCount: state?.unreadCount ?? 0,
    updatedAt: conversation.updatedAt,
  };
}

export function serializeReview(review) {
  return {
    id: idOf(review),
    author: review.legacy ? null : serializePublicUser(review.author),
    legacy: Boolean(review.legacy),
    targetId: idOf(review.target),
    requestId: idOf(review.request),
    rating: review.rating,
    comment: review.comment ?? null,
    createdAt: review.createdAt,
  };
}
