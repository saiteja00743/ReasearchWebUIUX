import { Router } from "express";
import { generateAiContent } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const aiRouter = Router();

aiRouter.post("/generate", requireAuth, generateAiContent);
