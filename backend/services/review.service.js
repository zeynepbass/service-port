import mongoose from "mongoose";
import { Conversation, Review, ServiceRequest, User, buildParticipantKey } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { cursorFilter, paginate } from "../utils/pagination.js";
import { getActiveUserOrFail } from "./user.service.js";

async function assertInteraction(authorId, targetId) {
  const conversation = await Conversation.exists({
    participantKey: buildParticipantKey(authorId, targetId),
    lastMessage: { $ne: null },
  });
  if (!conversation) {
    throw AppError.forbidden("Yalnızca mesajlaştığınız kullanıcıları değerlendirebilirsiniz", {
      code: "NO_INTERACTION",
    });
  }
}

async function assertRequestRelated(requestId, authorId, targetId) {
  const request = await ServiceRequest.findById(requestId).select("owner");
  const ownerId = request?.owner.toString();
  if (!request || ![authorId.toString(), targetId.toString()].includes(ownerId)) {
    throw AppError.badRequest("Talep bu değerlendirmeyle ilişkili değil", { code: "INVALID_REQUEST" });
  }
}

export async function recalculateRating(userId) {
  const [summary] = await Review.aggregate([
    { $match: { target: new mongoose.Types.ObjectId(userId.toString()) } },
    { $group: { _id: "$target", average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        ratingAverage: summary ? Math.round(summary.average * 10) / 10 : 0,
        ratingCount: summary?.count ?? 0,
      },
    },
  );
}

export async function createReview(authorId, { targetId, requestId, rating, comment }) {
  if (authorId.toString() === targetId) {
    throw AppError.badRequest("Kendinizi değerlendiremezsiniz", { code: "SELF_REVIEW" });
  }

  await getActiveUserOrFail(targetId);
  await assertInteraction(authorId, targetId);
  if (requestId) {
    await assertRequestRelated(requestId, authorId, targetId);
  }

  try {
    const review = await Review.create({
      author: authorId,
      target: targetId,
      request: requestId ?? null,
      rating,
      comment: comment || null,
    });
    await recalculateRating(targetId);
    return review.populate("author", "firstName lastName avatar");
  } catch (error) {
    if (error?.code === 11000) {
      throw AppError.conflict("Bu kullanıcıyı bu talep için zaten değerlendirdiniz", {
        code: "REVIEW_EXISTS",
      });
    }
    throw error;
  }
}

export async function listReviews({ user, cursor, limit }) {
  const reviews = await Review.find({ target: user, ...cursorFilter(cursor, "desc") })
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate("author", "firstName lastName avatar");
  return paginate(reviews, limit);
}
