import multer from "multer";
import { ApiError } from "./error-handler.js";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) cb(new ApiError(415, "Unsupported file type"));
    else cb(null, true);
  }
});
