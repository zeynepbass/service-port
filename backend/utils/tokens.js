import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ISSUER = "hizmet-kap";
const AUDIENCE = "hizmet-kap-app";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export function signAccessToken(user) {
  return jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, {
    subject: user._id.toString(),
    expiresIn: env.ACCESS_TOKEN_TTL_MINUTES * 60,
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithms: ["HS256"],
  });
  return { id: payload.sub, role: payload.role };
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
  };
}

export function setAuthCookies(res, { accessToken, refreshToken, refreshExpiresAt }) {
  const options = baseCookieOptions();
  res.cookie(ACCESS_COOKIE, accessToken, { ...options, maxAge: env.ACCESS_TOKEN_TTL_MINUTES * 60 * 1000 });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...options, expires: refreshExpiresAt });
}

export function clearAuthCookies(res) {
  const options = baseCookieOptions();
  res.clearCookie(ACCESS_COOKIE, options);
  res.clearCookie(REFRESH_COOKIE, options);
}
