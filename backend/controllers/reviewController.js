import * as reviewService from "../services/review.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/respond.js";
import { serializeReview } from "../utils/serializers.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  created(res, serializeReview(review));
});

export const listReviews = asyncHandler(async (req, res) => {
  const { items, meta } = await reviewService.listReviews(req.query);
  ok(res, items.map(serializeReview), meta);
});
