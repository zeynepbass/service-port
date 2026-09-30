import * as categoryService from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, noContent, ok } from "../utils/respond.js";
import { serializeCategory } from "../utils/serializers.js";

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  ok(res, categories.map(serializeCategory));
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryByKey(req.params.key);
  ok(res, serializeCategory(category));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  created(res, serializeCategory(category));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.key, req.body);
  ok(res, serializeCategory(category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.key);
  noContent(res);
});
