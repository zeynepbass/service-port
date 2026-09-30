import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: null, maxlength: 500 },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1 });

export const Category = mongoose.model("Category", categorySchema);
