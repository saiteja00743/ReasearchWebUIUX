import { Router } from "express";
import { uploadAsset } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

export const uploadRouter = Router();

uploadRouter.post("/", requireAuth, upload.single("file"), uploadAsset);
