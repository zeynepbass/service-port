import { AppError } from "../utils/AppError.js";

const SOURCES = ["params", "query", "body"];

export function validate(schemas) {
  return function validateRequest(req, res, next) {
    const errors = [];

    for (const source of SOURCES) {
      const schema = schemas[source];
      if (!schema) continue;

      const result = schema.safeParse(req[source] ?? {});
      if (result.success) {
        req[source] = result.data;
      } else {
        errors.push(
          ...result.error.issues.map((issue) => ({
            source,
            path: issue.path.join("."),
            message: issue.message,
          })),
        );
      }
    }

    if (errors.length > 0) {
      return next(
        AppError.badRequest("Gönderilen veriler geçersiz", {
          code: "VALIDATION_ERROR",
          details: errors,
        }),
      );
    }

    return next();
  };
}
