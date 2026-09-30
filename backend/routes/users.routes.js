import { Router } from "express";
import * as users from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { cleanupUploadOnError } from "../middleware/cleanupUpload.js";
import { avatarUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { cursorQuery, idParams } from "../validators/common.js";
import { deleteAccountSchema, updateProfileSchema } from "../validators/user.schemas.js";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole("admin"), validate({ query: cursorQuery }), users.listUsers);
router.get("/me", users.getMe);
router.patch(
  "/me",
  avatarUpload,
  validate({ body: updateProfileSchema }),
  users.updateMe,
  cleanupUploadOnError,
);
router.post("/me/deactivate", users.deactivateMe);
router.delete("/me", validate({ body: deleteAccountSchema }), users.deleteMe);
router.get("/:id", validate({ params: idParams }), users.getUser);

export default router;
