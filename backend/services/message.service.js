import { Conversation, Message, ServiceRequest, buildParticipantKey } from "../models/index.js";
import { emitToUsers } from "../sockets/emitter.js";
import { AppError } from "../utils/AppError.js";
import { cursorFilter, paginate } from "../utils/pagination.js";
import { serializeConversation, serializeMessage } from "../utils/serializers.js";
import { getActiveUserOrFail } from "./user.service.js";

const PARTICIPANT_FIELDS = "firstName lastName avatar ratingAverage ratingCount";

function populateConversation(query) {
  return query.populate("participants", PARTICIPANT_FIELDS).populate("request", "title");
}

function stateOf(conversation, userId) {
  return conversation.states.find((state) => state.user.toString() === userId.toString());
}

async function findParticipantConversation(userId, conversationId) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !stateOf(conversation, userId)) {
    throw AppError.notFound("Konuşma bulunamadı");
  }
  return conversation;
}

export async function listConversations(userId) {
  const conversations = await populateConversation(
    Conversation.find({ states: { $elemMatch: { user: userId, hidden: false } } }).sort({
      updatedAt: -1,
    }),
  );
  return conversations.map((conversation) => serializeConversation(conversation, userId));
}

export async function openConversation(userId, { recipientId, requestId }) {
  if (recipientId === userId.toString()) {
    throw AppError.badRequest("Kendinize mesaj gönderemezsiniz", { code: "SELF_CONVERSATION" });
  }

  await getActiveUserOrFail(recipientId);

  if (requestId) {
    const request = await ServiceRequest.findById(requestId).select("owner");
    const ownerId = request?.owner.toString();
    if (!request || (ownerId !== userId.toString() && ownerId !== recipientId)) {
      throw AppError.badRequest("Talep bu konuşmayla ilişkilendirilemez", { code: "INVALID_REQUEST" });
    }
  }

  const participantKey = buildParticipantKey(userId, recipientId);
  let conversation = await Conversation.findOne({ participantKey });

  if (!conversation) {
    try {
      conversation = await Conversation.create({
        participants: [userId, recipientId],
        participantKey,
        states: [{ user: userId }, { user: recipientId }],
        request: requestId ?? null,
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
      conversation = await Conversation.findOne({ participantKey });
    }
  }

  const state = stateOf(conversation, userId);
  if (!state) {
    throw AppError.notFound("Konuşma bulunamadı");
  }
  state.hidden = false;
  if (requestId) conversation.request = requestId;
  await conversation.save();

  const populated = await populateConversation(Conversation.findById(conversation._id));
  return serializeConversation(populated, userId);
}

export async function getConversation(userId, conversationId) {
  await findParticipantConversation(userId, conversationId);
  const populated = await populateConversation(Conversation.findById(conversationId));
  return serializeConversation(populated, userId);
}

export async function listMessages(userId, conversationId, { cursor, limit }) {
  const conversation = await findParticipantConversation(userId, conversationId);
  const { clearedAt } = stateOf(conversation, userId);

  const messages = await Message.find({
    conversation: conversation._id,
    ...cursorFilter(cursor, "desc"),
    ...(clearedAt && { createdAt: { $gt: clearedAt } }),
  })
    .sort({ _id: -1 })
    .limit(limit + 1);

  const page = paginate(messages, limit);
  return { items: page.items.map(serializeMessage), meta: page.meta };
}

export async function sendMessage(userId, conversationId, text) {
  const conversation = await findParticipantConversation(userId, conversationId);
  const recipientId = conversation.participants.find((id) => id.toString() !== userId.toString());
  const recipientState = stateOf(conversation, recipientId);

  if (!recipientState) {
    throw AppError.unprocessable("Karşı taraf artık mesaj alamıyor", { code: "RECIPIENT_GONE" });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: userId,
    recipient: recipientId,
    text,
  });

  const updated = await Conversation.findOneAndUpdate(
    { _id: conversation._id },
    {
      $set: {
        lastMessage: { text: message.text, sender: userId, createdAt: message.createdAt },
        "states.$[].hidden": false,
      },
      $inc: { "states.$[recipient].unreadCount": 1 },
    },
    { new: true, arrayFilters: [{ "recipient.user": recipientId }] },
  ).populate("participants", PARTICIPANT_FIELDS).populate("request", "title");

  const payload = serializeMessage(message);
  emitToUsers([userId], "message:new", {
    message: payload,
    conversation: serializeConversation(updated, userId),
  });
  emitToUsers([recipientId], "message:new", {
    message: payload,
    conversation: serializeConversation(updated, recipientId),
  });

  return payload;
}

export async function markConversationRead(userId, conversationId) {
  const conversation = await findParticipantConversation(userId, conversationId);
  const readAt = new Date();

  await Message.updateMany(
    { conversation: conversation._id, recipient: userId, readAt: null },
    { $set: { readAt } },
  );

  await Conversation.updateOne(
    { _id: conversation._id },
    { $set: { "states.$[me].unreadCount": 0, "states.$[me].lastReadAt": readAt } },
    { arrayFilters: [{ "me.user": userId }], timestamps: false },
  );

  const otherIds = conversation.participants.filter((id) => id.toString() !== userId.toString());
  emitToUsers(otherIds, "conversation:read", {
    conversationId: conversation._id.toString(),
    readerId: userId.toString(),
    readAt,
  });
  emitToUsers([userId], "conversation:read", {
    conversationId: conversation._id.toString(),
    readerId: userId.toString(),
    readAt,
  });

  return { readAt };
}

export async function hideConversation(userId, conversationId) {
  const conversation = await findParticipantConversation(userId, conversationId);
  await Conversation.updateOne(
    { _id: conversation._id },
    {
      $set: {
        "states.$[me].hidden": true,
        "states.$[me].clearedAt": new Date(),
        "states.$[me].unreadCount": 0,
      },
    },
    { arrayFilters: [{ "me.user": userId }], timestamps: false },
  );
}
