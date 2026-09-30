import { Router } from "express";
import * as reviews from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema, listReviewsQuery } from "../validators/review.schemas.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: listReviewsQuery }), reviews.listReviews);
router.post("/", validate({ body: createReviewSchema }), reviews.createReview);

export default router;
