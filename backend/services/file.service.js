import fs from "node:fs/promises";
import path from "node:path";
import { uploadDirectory } from "../middleware/upload.js";
import { AppError } from "../utils/AppError.js";

const SIGNATURES = [
  (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  (bytes) => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  (bytes) =>
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP",
];

export async function assertImageFile(file) {
  const handle = await fs.open(file.path, "r");
  try {
    const { buffer } = await handle.read(Buffer.alloc(12), 0, 12, 0);
    if (!SIGNATURES.some((matches) => matches(buffer))) {
      throw AppError.badRequest("Dosya içeriği geçerli bir görsel değil");
    }
  } finally {
    await handle.close();
  }
}

export async function removeUpload(fileName) {
  if (!fileName) return;
  const target = path.join(uploadDirectory, path.basename(fileName));
  await fs.rm(target, { force: true });
}
