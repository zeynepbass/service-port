import { AppError } from "../utils/AppError.js";
import { ACCESS_COOKIE, verifyAccessToken } from "../utils/tokens.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.[ACCESS_COOKIE];

  if (!token) {
    return next(AppError.unauthorized());
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(AppError.unauthorized("Oturum süresi doldu", { code: "TOKEN_INVALID" }));
  }
}

export function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden());
    }
    return next();
  };
}
