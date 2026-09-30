import { z } from "zod";
import { cursorQuery, objectId } from "./common.js";

export const openConversationSchema = z
  .object({
    recipientId: objectId,
    requestId: objectId.nullable().optional(),
  })
  .strict();

export const sendMessageSchema = z
  .object({
    text: z.string().trim().min(1, "Mesaj boş olamaz").max(2000),
  })
  .strict();

export const listMessagesQuery = cursorQuery;
