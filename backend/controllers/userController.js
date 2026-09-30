import { assertImageFile } from "../services/file.service.js";
import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { noContent, ok } from "../utils/respond.js";
import { serializePrivateUser, serializePublicUser } from "../utils/serializers.js";
import { clearAuthCookies } from "../utils/tokens.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserOrFail(req.user.id);
  ok(res, serializePrivateUser(user));
});

export const updateMe = asyncHandler(async (req, res) => {
  if (req.file) {
    await assertImageFile(req.file);
  }
  const user = await userService.updateProfile(req.user.id, req.body, req.file?.filename);
  ok(res, serializePrivateUser(user));
});

export const deactivateMe = asyncHandler(async (req, res) => {
  await userService.deactivateAccount(req.user.id);
  clearAuthCookies(res);
  noContent(res);
});

export const deleteMe = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user.id, req.body.password);
  clearAuthCookies(res);
  noContent(res);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getActiveUserOrFail(req.params.id);
  ok(res, serializePublicUser(user));
});

export const listUsers = asyncHandler(async (req, res) => {
  const { items, meta } = await userService.listUsers(req.query);
  ok(res, items.map(serializePrivateUser), meta);
});
