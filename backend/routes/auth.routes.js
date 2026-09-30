import { Router } from "express";
import * as auth from "../controllers/authController.js";
import { authRateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.schemas.js";

const router = Router();

router.post("/register", authRateLimit, validate({ body: registerSchema }), auth.register);
router.post("/login", authRateLimit, validate({ body: loginSchema }), auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
router.post("/forgot-password", authRateLimit, validate({ body: forgotPasswordSchema }), auth.forgotPassword);
router.post("/reset-password", authRateLimit, validate({ body: resetPasswordSchema }), auth.resetPassword);

export default router;
