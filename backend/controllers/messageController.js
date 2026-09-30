import * as messageService from "../services/message.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, noContent, ok } from "../utils/respond.js";

export const listConversations = asyncHandler(async (req, res) => {
  ok(res, await messageService.listConversations(req.user.id));
});

export const openConversation = asyncHandler(async (req, res) => {
  ok(res, await messageService.openConversation(req.user.id, req.body));
});

export const getConversation = asyncHandler(async (req, res) => {
  ok(res, await messageService.getConversation(req.user.id, req.params.id));
});

export const listMessages = asyncHandler(async (req, res) => {
  const { items, meta } = await messageService.listMessages(req.user.id, req.params.id, req.query);
  ok(res, items, meta);
});

export const sendMessage = asyncHandler(async (req, res) => {
  created(res, await messageService.sendMessage(req.user.id, req.params.id, req.body.text));
});

export const markRead = asyncHandler(async (req, res) => {
  ok(res, await messageService.markConversationRead(req.user.id, req.params.id));
});

export const hideConversation = asyncHandler(async (req, res) => {
  await messageService.hideConversation(req.user.id, req.params.id);
  noContent(res);
});
