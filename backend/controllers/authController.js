import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, noContent, ok } from "../utils/respond.js";
import { serializePrivateUser } from "../utils/serializers.js";
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from "../utils/tokens.js";

const PASSWORD_RESET_MESSAGE =
  "Bu e-posta adresine kayıtlı bir hesap varsa parola sıfırlama bağlantısı gönderildi.";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  created(res, serializePrivateUser(user));
});

export const login = asyncHandler(async (req, res) => {
  const session = await authService.login(req.body);
  setAuthCookies(res, session);
  ok(res, serializePrivateUser(session.user));
});

export const refresh = asyncHandler(async (req, res) => {
  try {
    const session = await authService.refreshSession(req.cookies?.[REFRESH_COOKIE]);
    setAuthCookies(res, session);
    ok(res, serializePrivateUser(session.user));
  } catch (error) {
    clearAuthCookies(res);
    throw error;
  }
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies?.[REFRESH_COOKIE]);
  clearAuthCookies(res);
  noContent(res);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email).catch((error) => {
    req.log?.error({ err: error }, "Parola sıfırlama e-postası gönderilemedi");
  });
  ok(res, { message: PASSWORD_RESET_MESSAGE });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  clearAuthCookies(res);
  ok(res, { message: "Parolanız güncellendi. Yeni parolanızla giriş yapabilirsiniz." });
});
