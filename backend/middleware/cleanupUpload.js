import { removeUpload } from "../services/file.service.js";

export function cleanupUploadOnError(error, req, res, next) {
  removeUpload(req.file?.filename).finally(() => next(error));
}
