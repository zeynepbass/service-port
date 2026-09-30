import multer from "multer";
import { AppError } from "../utils/AppError.js";

export function notFoundHandler(req, res, next) {
  next(AppError.notFound("İstenen kaynak bulunamadı"));
}

function normalizeError(error) {
  if (error instanceof AppError) return error;

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE" ? "Dosya boyutu en fazla 5 MB olabilir" : "Dosya yüklenemedi";
    return AppError.badRequest(message, { code: error.code });
  }

  if (error?.type === "entity.too.large") {
    return new AppError(413, "İstek gövdesi çok büyük");
  }

  if (error?.type === "entity.parse.failed") {
    return AppError.badRequest("Geçersiz JSON gövdesi");
  }

  if (error?.name === "CastError") {
    return AppError.badRequest("Geçersiz kimlik");
  }

  if (error?.code === 11000) {
    return AppError.conflict();
  }

  if (error?.name === "ValidationError") {
    return AppError.badRequest("Gönderilen veriler geçersiz", { code: "VALIDATION_ERROR" });
  }

  return new AppError(500, "Beklenmeyen bir hata oluştu");
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const appError = normalizeError(error);

  if (appError.statusCode >= 500) {
    req.log?.error({ err: error }, "İstek işlenirken hata oluştu");
  }

  return res.status(appError.statusCode).json({
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details && { details: appError.details }),
      requestId: req.id,
    },
  });
}
