import { Router } from "express";
import * as requests from "../controllers/requestController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParams } from "../validators/common.js";
import {
  createRequestSchema,
  listRequestsQuery,
  updateRequestSchema,
  updateStatusSchema,
} from "../validators/request.schemas.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: listRequestsQuery }), requests.listRequests);
router.post("/", validate({ body: createRequestSchema }), requests.createRequest);
router.get("/:id", validate({ params: idParams }), requests.getRequest);
router.patch("/:id", validate({ params: idParams, body: updateRequestSchema }), requests.updateRequest);
router.patch("/:id/status", validate({ params: idParams, body: updateStatusSchema }), requests.changeStatus);

export default router;
