import mongoose from "mongoose";
import { AppError } from "./AppError.js";

export function encodeCursor(document) {
  return Buffer.from(document._id.toString()).toString("base64url");
}

export function decodeCursor(cursor) {
  if (!cursor) return null;
  const id = Buffer.from(cursor, "base64url").toString("utf8");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest("Geçersiz sayfalama imleci");
  }
  return new mongoose.Types.ObjectId(id);
}

export function cursorFilter(cursor, direction) {
  const id = decodeCursor(cursor);
  if (!id) return {};
  return { _id: direction === "asc" ? { $gt: id } : { $lt: id } };
}

export function paginate(documents, limit) {
  const hasMore = documents.length > limit;
  const items = hasMore ? documents.slice(0, limit) : documents;
  return {
    items,
    meta: { nextCursor: hasMore ? encodeCursor(items.at(-1)) : null, hasMore },
  };
}
