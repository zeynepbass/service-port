import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const EXTENSIONS_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const uploadDirectory = path.resolve(process.cwd(), env.UPLOAD_DIR);
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename(req, file, callback) {
    callback(null, `${crypto.randomUUID()}${EXTENSIONS_BY_MIME[file.mimetype]}`);
  },
});

function fileFilter(req, file, callback) {
  if (!EXTENSIONS_BY_MIME[file.mimetype]) {
    return callback(AppError.badRequest("Yalnızca JPG, PNG veya WEBP yükleyebilirsiniz"));
  }
  return callback(null, true);
}

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1, fields: 10 },
}).single("avatar");
