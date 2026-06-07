import { Router } from "express";
import { forgotPassword, login, logout, refresh, register, verifyEmail } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, validateBody(registerSchema), register);
authRouter.post("/login", authLimiter, validateBody(loginSchema), login);
authRouter.post("/google", authLimiter, (_req, res) => res.json({ message: "Google OAuth callback endpoint" }));
authRouter.post("/forgot-password", authLimiter, forgotPassword);
authRouter.post("/verify-email", authLimiter, verifyEmail);
authRouter.post("/refresh", authLimiter, refresh);
authRouter.post("/logout", logout);
