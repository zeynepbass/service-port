import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./categories.routes.js";
import messageRoutes from "./messages.routes.js";
import requestRoutes from "./requests.routes.js";
import reviewRoutes from "./reviews.routes.js";
import userRoutes from "./users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/requests", requestRoutes);
router.use("/messages", messageRoutes);
router.use("/reviews", reviewRoutes);

export default router;
