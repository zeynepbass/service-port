import mongoose from "mongoose";

const lastMessageSchema = new mongoose.Schema(
  {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: Date,
  },
  { _id: false },
);

const participantStateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    unreadCount: { type: Number, default: 0, min: 0 },
    lastReadAt: { type: Date, default: null },
    clearedAt: { type: Date, default: null },
    hidden: { type: Boolean, default: false },
  },
  { _id: false },
);

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: [(participants) => participants.length === 2, "Konuşma iki katılımcılı olmalıdır"],
    },
    participantKey: { type: String, required: true, unique: true },
    states: { type: [participantStateSchema], default: [] },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", default: null },
    lastMessage: { type: lastMessageSchema, default: null },
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1, updatedAt: -1 });

export function buildParticipantKey(userA, userB) {
  return [userA.toString(), userB.toString()].sort().join(":");
}

export const Conversation = mongoose.model("Conversation", conversationSchema);
