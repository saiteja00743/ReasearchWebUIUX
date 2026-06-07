import { Router } from "express";
import { createPublication, discoverPublications, getPublication, updatePublicationStatus } from "../controllers/publication.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { publicationSchema } from "../validators/publication.validator.js";

export const publicationRouter = Router();

publicationRouter.get("/", discoverPublications);
publicationRouter.get("/:slug", getPublication);
publicationRouter.post("/", requireAuth, validateBody(publicationSchema), createPublication);
publicationRouter.patch("/:id/review", requireAuth, requireRole("reviewer", "admin"), updatePublicationStatus);
publicationRouter.post("/:id/like", requireAuth, (_req, res) => res.json({ ok: true }));
publicationRouter.post("/:id/bookmark", requireAuth, (_req, res) => res.json({ ok: true }));
publicationRouter.post("/:id/download", (_req, res) => res.json({ ok: true }));
