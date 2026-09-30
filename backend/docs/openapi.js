import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.schemas.js";
import {
  categoryKeyParams,
  createCategorySchema,
  templateSchema,
  updateCategorySchema,
} from "../validators/category.schemas.js";
import { cursorQuery, idParams } from "../validators/common.js";
import {
  listMessagesQuery,
  openConversationSchema,
  sendMessageSchema,
} from "../validators/message.schemas.js";
import {
  createRequestSchema,
  listRequestsQuery,
  updateRequestSchema,
  updateStatusSchema,
} from "../validators/request.schemas.js";
import { createReviewSchema, listReviewsQuery } from "../validators/review.schemas.js";
import { deleteAccountSchema, updateProfileSchema } from "../validators/user.schemas.js";

const errorResponse = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.object({ source: z.string(), path: z.string(), message: z.string() })).optional(),
    requestId: z.string().optional(),
  }),
});

const dataResponse = z.object({ data: z.any(), meta: z.any().optional() });

const json = (schema) => ({ content: { "application/json": { schema } } });

function standardResponses(successStatus = 200) {
  return {
    [successStatus]: { description: "Başarılı", ...(successStatus !== 204 && json(dataResponse)) },
    400: { description: "Geçersiz istek", ...json(errorResponse) },
    401: { description: "Oturum gerekli", ...json(errorResponse) },
    403: { description: "Yetki yok", ...json(errorResponse) },
    404: { description: "Bulunamadı", ...json(errorResponse) },
  };
}

const ROUTES = [
  ["post", "/api/auth/register", "Auth", "Kayıt ol", { body: registerSchema }, 201, false],
  ["post", "/api/auth/login", "Auth", "Giriş yap, oturum çerezlerini ayarlar", { body: loginSchema }, 200, false],
  ["post", "/api/auth/refresh", "Auth", "Refresh token rotasyonu", {}, 200, false],
  ["post", "/api/auth/logout", "Auth", "Oturumu kapat", {}, 204, false],
  ["post", "/api/auth/forgot-password", "Auth", "Parola sıfırlama bağlantısı iste", { body: forgotPasswordSchema }, 200, false],
  ["post", "/api/auth/reset-password", "Auth", "Parolayı sıfırla", { body: resetPasswordSchema }, 200, false],
  ["get", "/api/users", "Users", "Kullanıcıları listele (admin)", { query: cursorQuery }],
  ["get", "/api/users/me", "Users", "Oturumdaki kullanıcı", {}],
  ["patch", "/api/users/me", "Users", "Profili güncelle (multipart, avatar alanı)", { body: updateProfileSchema, multipart: true }],
  ["post", "/api/users/me/deactivate", "Users", "Hesabı dondur", {}, 204],
  ["delete", "/api/users/me", "Users", "Hesabı sil", { body: deleteAccountSchema }, 204],
  ["get", "/api/users/{id}", "Users", "Herkese açık profil", { params: idParams }],
  ["get", "/api/categories", "Categories", "Kategorileri listele", {}, 200, false],
  ["get", "/api/categories/{key}", "Categories", "Kategori (id veya slug)", { params: categoryKeyParams }, 200, false],
  ["post", "/api/categories", "Categories", "Kategori oluştur (admin)", { body: createCategorySchema }, 201],
  ["patch", "/api/categories/{key}", "Categories", "Kategori güncelle (admin)", { params: categoryKeyParams, body: updateCategorySchema }],
  ["delete", "/api/categories/{key}", "Categories", "Kategori sil (admin)", { params: categoryKeyParams }, 204],
  ["get", "/api/categories/{key}/template", "Categories", "Talep şablonu", { params: categoryKeyParams }],
  ["put", "/api/categories/{key}/template", "Categories", "Talep şablonunu kaydet (admin)", { params: categoryKeyParams, body: templateSchema }],
  ["get", "/api/requests", "Requests", "Talepleri listele (cursor sayfalama)", { query: listRequestsQuery }],
  ["post", "/api/requests", "Requests", "Talep oluştur", { body: createRequestSchema }, 201],
  ["get", "/api/requests/{id}", "Requests", "Talep detayı", { params: idParams }],
  ["patch", "/api/requests/{id}", "Requests", "Talebi güncelle (sahip)", { params: idParams, body: updateRequestSchema }],
  ["patch", "/api/requests/{id}/status", "Requests", "Talep durumunu değiştir (sahip)", { params: idParams, body: updateStatusSchema }],
  ["get", "/api/messages/conversations", "Messages", "Konuşmaları listele", {}],
  ["post", "/api/messages/conversations", "Messages", "Konuşma aç veya getir", { body: openConversationSchema }],
  ["get", "/api/messages/conversations/{id}", "Messages", "Konuşma detayı", { params: idParams }],
  ["delete", "/api/messages/conversations/{id}", "Messages", "Konuşmayı kendi görünümünden sil", { params: idParams }, 204],
  ["get", "/api/messages/conversations/{id}/messages", "Messages", "Mesajları listele", { params: idParams, query: listMessagesQuery }],
  ["post", "/api/messages/conversations/{id}/messages", "Messages", "Mesaj gönder", { params: idParams, body: sendMessageSchema }, 201],
  ["post", "/api/messages/conversations/{id}/read", "Messages", "Okundu olarak işaretle", { params: idParams }],
  ["get", "/api/reviews", "Reviews", "Kullanıcı değerlendirmeleri", { query: listReviewsQuery }],
  ["post", "/api/reviews", "Reviews", "Değerlendirme oluştur", { body: createReviewSchema }, 201],
];

export function buildOpenApiDocument() {
  const registry = new OpenAPIRegistry();

  registry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "access_token",
  });

  for (const [method, path, tag, summary, input, status = 200, secured = true] of ROUTES) {
    const request = {};
    if (input.params) request.params = input.params;
    if (input.query) request.query = input.query;
    if (input.body) {
      request.body = {
        content: { [input.multipart ? "multipart/form-data" : "application/json"]: { schema: input.body } },
      };
    }

    registry.registerPath({
      method,
      path,
      tags: [tag],
      summary,
      request,
      responses: standardResponses(status),
      ...(secured && { security: [{ cookieAuth: [] }] }),
    });
  }

  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: "3.1.0",
    info: { title: "Hizmet Kap API", version: "1.0.0" },
  });
}
