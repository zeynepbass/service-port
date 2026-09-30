import { Conversation, RefreshToken, ServiceRequest, User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { cursorFilter, paginate } from "../utils/pagination.js";
import { verifyPassword } from "./auth.service.js";
import { removeUpload } from "./file.service.js";

export async function getUserOrFail(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound("Kullanıcı bulunamadı");
  }
  return user;
}

export async function getActiveUserOrFail(userId) {
  const user = await getUserOrFail(userId);
  if (!user.isActive) {
    throw AppError.notFound("Kullanıcı bulunamadı");
  }
  return user;
}

export async function updateProfile(userId, changes, avatarFileName) {
  const user = await getUserOrFail(userId);

  if (changes.email && changes.email !== user.email) {
    const taken = await User.exists({ email: changes.email, _id: { $ne: user._id } });
    if (taken) {
      throw AppError.conflict("Bu e-posta adresi kullanılamıyor", { code: "EMAIL_TAKEN" });
    }
  }

  const previousAvatar = user.avatar;
  Object.assign(user, changes);
  if (avatarFileName) {
    user.avatar = avatarFileName;
  }

  await user.save();

  if (avatarFileName && previousAvatar && previousAvatar !== avatarFileName) {
    await removeUpload(previousAvatar);
  }

  return user;
}

export async function deactivateAccount(userId) {
  const user = await getUserOrFail(userId);
  user.isActive = false;
  await user.save();
  await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export async function deleteAccount(userId, password) {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    throw AppError.notFound("Kullanıcı bulunamadı");
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    throw AppError.unauthorized("Parola hatalı", { code: "INVALID_PASSWORD" });
  }

  await Promise.all([
    ServiceRequest.deleteMany({ owner: user._id }),
    RefreshToken.deleteMany({ user: user._id }),
    Conversation.updateMany({ participants: user._id }, { $pull: { states: { user: user._id } } }),
  ]);
  await user.deleteOne();
  await removeUpload(user.avatar);
}

export async function listUsers({ cursor, limit }) {
  const users = await User.find(cursorFilter(cursor, "desc"))
    .sort({ _id: -1 })
    .limit(limit + 1);
  return paginate(users, limit);
}
