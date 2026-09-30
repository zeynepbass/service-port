import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { PasswordResetToken, RefreshToken, User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { generateToken, hashToken } from "../utils/crypto.js";
import { signAccessToken } from "../utils/tokens.js";
import { sendPasswordResetMail } from "./mail.service.js";

const BCRYPT_ROUNDS = env.NODE_ENV === "test" ? 4 : 12;
const DUMMY_HASH = bcrypt.hashSync("timing-safe-placeholder", BCRYPT_ROUNDS);
const INVALID_CREDENTIALS = "E-posta veya parola hatalı";

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash ?? DUMMY_HASH);
}

export async function register({ firstName, lastName, email, password }) {
  const exists = await User.exists({ email });
  if (exists) {
    throw AppError.conflict("Bu e-posta adresiyle kayıt oluşturulamıyor", { code: "EMAIL_TAKEN" });
  }

  return User.create({ firstName, lastName, email, passwordHash: await hashPassword(password) });
}

async function createRefreshToken(userId, family = crypto.randomUUID()) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ user: userId, tokenHash: hashToken(token), family, expiresAt });
  return { token, expiresAt, family };
}

async function issueSession(user, family) {
  const refresh = await createRefreshToken(user._id, family);
  return {
    user,
    accessToken: signAccessToken(user),
    refreshToken: refresh.token,
    refreshExpiresAt: refresh.expiresAt,
  };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+passwordHash");
  const passwordMatches = await verifyPassword(password, user?.passwordHash);

  if (!user || !passwordMatches) {
    throw AppError.unauthorized(INVALID_CREDENTIALS, { code: "INVALID_CREDENTIALS" });
  }

  if (!user.isActive) {
    user.isActive = true;
    await user.save();
  }

  return issueSession(user);
}

export async function refreshSession(rawToken) {
  if (!rawToken) {
    throw AppError.unauthorized();
  }

  const stored = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });

  if (!stored || stored.expiresAt < new Date()) {
    throw AppError.unauthorized("Oturum süresi doldu", { code: "REFRESH_INVALID" });
  }

  if (stored.revokedAt) {
    await RefreshToken.updateMany(
      { family: stored.family, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
    throw AppError.unauthorized("Oturum güvenlik nedeniyle sonlandırıldı", {
      code: "REFRESH_REUSED",
    });
  }

  const user = await User.findById(stored.user);
  if (!user || !user.isActive) {
    await RefreshToken.updateMany({ family: stored.family }, { $set: { revokedAt: new Date() } });
    throw AppError.unauthorized();
  }

  const session = await issueSession(user, stored.family);
  const claimed = await RefreshToken.updateOne(
    { _id: stored._id, revokedAt: null },
    { $set: { revokedAt: new Date(), replacedBy: hashToken(session.refreshToken) } },
  );

  if (claimed.modifiedCount === 0) {
    await RefreshToken.updateMany({ family: stored.family }, { $set: { revokedAt: new Date() } });
    throw AppError.unauthorized("Oturum güvenlik nedeniyle sonlandırıldı", {
      code: "REFRESH_REUSED",
    });
  }

  return session;
}

export async function logout(rawToken) {
  if (!rawToken) return;
  const stored = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });
  if (stored) {
    await RefreshToken.updateMany({ family: stored.family }, { $set: { revokedAt: new Date() } });
  }
}

export async function revokeAllSessions(userId) {
  await RefreshToken.updateMany({ user: userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) return;

  await PasswordResetToken.deleteMany({ user: user._id, usedAt: null });

  const token = generateToken(32);
  await PasswordResetToken.create({
    user: user._id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + env.PASSWORD_RESET_TTL_MINUTES * 60 * 1000),
  });

  const resetUrl = new URL("/sifre-sifirla", env.CLIENT_URL);
  resetUrl.searchParams.set("token", token);

  await sendPasswordResetMail({
    to: user.email,
    firstName: user.firstName,
    resetUrl: resetUrl.toString(),
    expiresInMinutes: env.PASSWORD_RESET_TTL_MINUTES,
  });
}

export async function resetPassword({ token, password }) {
  const now = new Date();
  const resetToken = await PasswordResetToken.findOneAndUpdate(
    { tokenHash: hashToken(token), usedAt: null, expiresAt: { $gt: now } },
    { $set: { usedAt: now } },
    { new: true },
  );

  if (!resetToken) {
    throw AppError.badRequest("Bağlantı geçersiz veya süresi dolmuş", { code: "RESET_TOKEN_INVALID" });
  }

  const user = await User.findById(resetToken.user);
  if (!user) {
    throw AppError.badRequest("Bağlantı geçersiz veya süresi dolmuş", { code: "RESET_TOKEN_INVALID" });
  }

  user.passwordHash = await hashPassword(password);
  await user.save();
  await revokeAllSessions(user._id);
}
