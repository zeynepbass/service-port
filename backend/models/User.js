import mongoose from "mongoose";

export const USER_ROLES = ["user", "admin"];

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true, maxlength: 50 },
    lastName: { type: String, trim: true, required: true, maxlength: 50 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: null },
    avatar: { type: String, default: null },
    role: { type: String, enum: USER_ROLES, default: "user" },
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
