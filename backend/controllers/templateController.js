import * as categoryService from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/respond.js";
import { serializeCategory, serializeTemplate } from "../utils/serializers.js";

function serializeResult({ category, template }) {
  return { category: serializeCategory(category), ...serializeTemplate(template) };
}

export const getTemplate = asyncHandler(async (req, res) => {
  ok(res, serializeResult(await categoryService.getTemplate(req.params.key)));
});

export const upsertTemplate = asyncHandler(async (req, res) => {
  ok(res, serializeResult(await categoryService.upsertTemplate(req.params.key, req.body)));
});
