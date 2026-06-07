import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { ApiError } from "../middleware/error-handler.js";
import { hashToken, signAccessToken, signRefreshToken } from "../services/token.service.js";

export async function register(req: Request, res: Response) {
  const { name, username, email, password } = req.body;
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new ApiError(409, "Email or username already exists");
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, username, email, passwordHash });
  res.status(201).json({ user: publicUser(user), message: "Verification email queued" });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");
  const passwordHash = user.get("passwordHash") as string | undefined;
  if (!passwordHash) throw new ApiError(401, "Invalid credentials");
  const ok = await bcrypt.compare(password, passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken({ id: user.id, role: user.get("role") });
  const refreshToken = signRefreshToken({ id: user.id });
  await Session.create({
    user: user._id,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  await user.updateOne({ lastLoginAt: new Date() });
  res.json({ user: publicUser(user), accessToken, refreshToken });
}

export async function forgotPassword(req: Request, res: Response) {
  res.json({ message: `Password reset email queued for ${req.body.email}` });
}

export async function verifyEmail(_req: Request, res: Response) {
  res.json({ message: "Email verified" });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(401, "Refresh token required");
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
  const session = await Session.findOne({ refreshTokenHash: hashToken(refreshToken), revokedAt: { $exists: false } });
  if (!session) throw new ApiError(401, "Refresh token revoked");
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, "User no longer exists");
  res.json({ accessToken: signAccessToken({ id: user.id, role: user.get("role") }) });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken) await Session.updateOne({ refreshTokenHash: hashToken(refreshToken) }, { revokedAt: new Date() });
  res.json({ ok: true });
}

function publicUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl
  };
}
