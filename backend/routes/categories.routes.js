import { Router } from "express";
import * as categories from "../controllers/categoryController.js";
import * as templates from "../controllers/templateController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  categoryKeyParams,
  createCategorySchema,
  templateSchema,
  updateCategorySchema,
} from "../validators/category.schemas.js";

const router = Router();
const adminOnly = [requireAuth, requireRole("admin")];

router.get("/", categories.listCategories);
router.get("/:key", validate({ params: categoryKeyParams }), categories.getCategory);
router.get("/:key/template", requireAuth, validate({ params: categoryKeyParams }), templates.getTemplate);

router.post("/", adminOnly, validate({ body: createCategorySchema }), categories.createCategory);
router.patch(
  "/:key",
  adminOnly,
  validate({ params: categoryKeyParams, body: updateCategorySchema }),
  categories.updateCategory,
);
router.delete("/:key", adminOnly, validate({ params: categoryKeyParams }), categories.deleteCategory);
router.put(
  "/:key/template",
  adminOnly,
  validate({ params: categoryKeyParams, body: templateSchema }),
  templates.upsertTemplate,
);

export default router;
