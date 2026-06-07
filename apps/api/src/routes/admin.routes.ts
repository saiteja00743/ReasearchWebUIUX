import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Publication } from "../models/publication.model.js";
import { User } from "../models/user.model.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));
adminRouter.get("/analytics", async (_req, res) => {
  const [users, publications, pending] = await Promise.all([
    User.countDocuments(),
    Publication.countDocuments({ status: "published" }),
    Publication.countDocuments({ status: "in_review" })
  ]);
  res.json({ users, publications, pending });
});
adminRouter.get("/users", async (_req, res) => res.json({ users: await User.find().limit(100) }));
adminRouter.get("/publications/review", async (_req, res) => res.json({ publications: await Publication.find({ status: "in_review" }) }));
