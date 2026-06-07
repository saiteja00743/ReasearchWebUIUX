import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "./error-handler.js";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, "Validation failed", parsed.error.flatten());
    req.body = parsed.data;
    next();
  };
}
