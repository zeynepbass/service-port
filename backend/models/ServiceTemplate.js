import mongoose from "mongoose";

const stepSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
  },
  { _id: false },
);

const serviceTemplateSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      unique: true,
    },
    steps: { type: [stepSchema], required: true },
  },
  { timestamps: true },
);

export const ServiceTemplate = mongoose.model("ServiceTemplate", serviceTemplateSchema);
