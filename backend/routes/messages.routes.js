import { Router } from "express";
import * as messages from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParams } from "../validators/common.js";
import {
  listMessagesQuery,
  openConversationSchema,
  sendMessageSchema,
} from "../validators/message.schemas.js";

const router = Router();

router.use(requireAuth);

router.get("/conversations", messages.listConversations);
router.post("/conversations", validate({ body: openConversationSchema }), messages.openConversation);
router.get("/conversations/:id", validate({ params: idParams }), messages.getConversation);
router.delete("/conversations/:id", validate({ params: idParams }), messages.hideConversation);
router.get(
  "/conversations/:id/messages",
  validate({ params: idParams, query: listMessagesQuery }),
  messages.listMessages,
);
router.post(
  "/conversations/:id/messages",
  validate({ params: idParams, body: sendMessageSchema }),
  messages.sendMessage,
);
router.post("/conversations/:id/read", validate({ params: idParams }), messages.markRead);

export default router;
