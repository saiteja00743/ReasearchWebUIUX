import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { UserRole } from "@researchhub/shared";

export function signAccessToken(payload: { id: string; role: UserRole }) {
  const expiresIn = (process.env.JWT_ACCESS_TTL ?? "15m") as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn });
}

export function signRefreshToken(payload: { id: string }) {
  const expiresIn = (process.env.JWT_REFRESH_TTL ?? "30d") as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn });
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
