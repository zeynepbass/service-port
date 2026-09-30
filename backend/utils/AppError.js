export class AppError extends Error {
  constructor(statusCode, message, { code, details } = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code ?? defaultCode(statusCode);
    this.details = details;
  }

  static badRequest(message = "Geçersiz istek", options) {
    return new AppError(400, message, options);
  }

  static unauthorized(message = "Oturum açmanız gerekiyor", options) {
    return new AppError(401, message, options);
  }

  static forbidden(message = "Bu işlem için yetkiniz yok", options) {
    return new AppError(403, message, options);
  }

  static notFound(message = "Kayıt bulunamadı", options) {
    return new AppError(404, message, options);
  }

  static conflict(message = "Kayıt zaten mevcut", options) {
    return new AppError(409, message, options);
  }

  static unprocessable(message = "İşlem gerçekleştirilemedi", options) {
    return new AppError(422, message, options);
  }
}

function defaultCode(statusCode) {
  const codes = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    413: "PAYLOAD_TOO_LARGE",
    422: "UNPROCESSABLE",
    429: "TOO_MANY_REQUESTS",
  };
  return codes[statusCode] ?? "INTERNAL_ERROR";
}
