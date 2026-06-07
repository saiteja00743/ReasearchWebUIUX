import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/user.model.js";
import { Publication } from "../models/publication.model.js";

export const userRouter = Router();

userRouter.get("/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select("-passwordHash -resetTokenHash -verificationTokenHash");
  const publications = user ? await Publication.find({ owner: user._id, status: "published" }).sort({ publishedAt: -1 }) : [];
  res.json({ user, publications });
});

userRouter.patch("/me", requireAuth, (_req, res) => res.json({ message: "Profile updated" }));
userRouter.post("/:username/follow", requireAuth, (_req, res) => res.json({ ok: true }));
