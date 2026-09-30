import { Category, ServiceTemplate, User } from "../models/index.js";
import { hashPassword } from "../services/auth.service.js";
import { toSlug } from "../utils/slug.js";
import { isDirectRun, runScript } from "./runScript.js";
import { SEED_CATEGORIES, SEED_USERS } from "./seedData.js";

export async function seed({ onlyIfEmpty = false, password = "Demo12345" } = {}) {
  if (onlyIfEmpty && (await Category.estimatedDocumentCount()) > 0) {
    return { skipped: true };
  }

  for (const { steps, ...category } of SEED_CATEGORIES) {
    const saved = await Category.findOneAndUpdate(
      { slug: toSlug(category.name) },
      { $set: { ...category, slug: toSlug(category.name) } },
      { upsert: true, new: true },
    );
    await ServiceTemplate.updateOne({ category: saved._id }, { $set: { steps } }, { upsert: true });
  }

  const passwordHash = await hashPassword(password);
  for (const user of SEED_USERS) {
    await User.updateOne(
      { email: user.email },
      { $setOnInsert: { ...user, passwordHash } },
      { upsert: true },
    );
  }

  return { categories: SEED_CATEGORIES.length, users: SEED_USERS.length };
}

if (isDirectRun(import.meta.url)) {
  const onlyIfEmpty = process.argv.includes("--if-empty");
  runScript("Seed", () => seed({ onlyIfEmpty, password: process.env.SEED_PASSWORD || undefined }));
}
