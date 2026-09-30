import mongoose from "mongoose";
import { Category, ServiceRequest, ServiceTemplate } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { toSlug } from "../utils/slug.js";

export function listCategories() {
  return Category.find().sort({ name: 1 });
}

export async function getCategoryByKey(key) {
  const query = mongoose.Types.ObjectId.isValid(key) ? { _id: key } : { slug: key.toLowerCase() };
  const category = await Category.findOne(query);
  if (!category) {
    throw AppError.notFound("Kategori bulunamadı");
  }
  return category;
}

async function assertSlugAvailable(slug, exceptId) {
  const exists = await Category.exists({ slug, ...(exceptId && { _id: { $ne: exceptId } }) });
  if (exists) {
    throw AppError.conflict("Bu isimde bir kategori zaten var", { code: "CATEGORY_EXISTS" });
  }
}

export async function createCategory(data) {
  const slug = toSlug(data.name);
  await assertSlugAvailable(slug);
  return Category.create({ ...data, slug });
}

export async function updateCategory(key, changes) {
  const category = await getCategoryByKey(key);
  if (changes.name) {
    const slug = toSlug(changes.name);
    await assertSlugAvailable(slug, category._id);
    category.slug = slug;
  }
  Object.assign(category, changes);
  return category.save();
}

export async function deleteCategory(key) {
  const category = await getCategoryByKey(key);
  const inUse = await ServiceRequest.exists({ category: category._id });
  if (inUse) {
    throw AppError.conflict("Talebi bulunan kategori silinemez", { code: "CATEGORY_IN_USE" });
  }
  await ServiceTemplate.deleteOne({ category: category._id });
  await category.deleteOne();
}

export async function getTemplate(key) {
  const category = await getCategoryByKey(key);
  const template = await ServiceTemplate.findOne({ category: category._id });
  if (!template) {
    throw AppError.notFound("Bu kategori için talep şablonu bulunamadı");
  }
  return { category, template };
}

export async function upsertTemplate(key, { steps }) {
  const category = await getCategoryByKey(key);
  const template = await ServiceTemplate.findOneAndUpdate(
    { category: category._id },
    { $set: { steps } },
    { new: true, upsert: true, runValidators: true },
  );
  return { category, template };
}
