import mongoose from "mongoose";

export const STORED_REQUEST_STATUSES = ["active", "passive", "cancelled"];

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], default: [] },
    selected: { type: String, required: true },
  },
  { _id: false },
);

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false },
);

const serviceRequestSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    title: { type: String, required: true, trim: true },
    answers: {
      type: [answerSchema],
      validate: [(answers) => answers.length > 0, "En az bir cevap gereklidir"],
    },
    status: { type: String, enum: STORED_REQUEST_STATUSES, default: "active" },
    phone: { type: String, default: null },
    location: { type: pointSchema, default: undefined },
    startsAt: { type: Date, default: () => new Date() },
    endsAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true },
);

serviceRequestSchema.index({ owner: 1, _id: -1 });
serviceRequestSchema.index({ category: 1, status: 1, _id: -1 });
serviceRequestSchema.index({ status: 1, endsAt: 1 });
serviceRequestSchema.index({ location: "2dsphere" });

export const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
