import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: null, maxlength: 1000 },
  },
  { timestamps: true },
);

reviewSchema.index({ author: 1, target: 1, request: 1 }, { unique: true });
reviewSchema.index({ target: 1, _id: -1 });

export const Review = mongoose.model("Review", reviewSchema);
