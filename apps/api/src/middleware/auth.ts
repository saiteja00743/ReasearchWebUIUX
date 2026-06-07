import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./error-handler.js";
import type { UserRole } from "@researchhub/shared";

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole };
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) throw new ApiError(401, "Authentication required");

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string; role: UserRole };
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new ApiError(403, "Insufficient permissions");
    next();
  };
}
