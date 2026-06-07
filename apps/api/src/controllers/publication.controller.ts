import type { Request, Response } from "express";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { Publication } from "../models/publication.model.js";
import { ApiError } from "../middleware/error-handler.js";
import type { AuthRequest } from "../middleware/auth.js";
import { cacheJson } from "../config/redis.js";
import { generateCitation } from "../services/ai.service.js";

export async function createPublication(req: AuthRequest, res: Response) {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const slugBase = slugify(req.body.title, { lower: true, strict: true });
  const slug = `${slugBase}-${nanoid(6)}`;
  const citation = await generateCitation({
    title: req.body.title,
    authors: req.body.authors.map((author: { name: string }) => author.name),
    url: `${process.env.APP_URL}/publication/${slug}`
  });
  const publication = await Publication.create({
    ...req.body,
    slug,
    citation,
    owner: req.user.id,
    publishedAt: req.body.status === "in_review" ? undefined : undefined
  });
  res.status(201).json({ publication });
}

export async function discoverPublications(req: Request, res: Response) {
  const { q, category, sort = "latest" } = req.query;
  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: String(q) };
  const sortMap = {
    latest: { publishedAt: -1 },
    trending: { "metrics.views": -1 },
    downloads: { "metrics.downloads": -1 }
  } as const;
  const publications = await cacheJson(`discover:${JSON.stringify(req.query)}`, 60, () =>
    Publication.find(filter).sort(sortMap[sort as keyof typeof sortMap] ?? sortMap.latest).limit(24).populate("owner", "name username avatarUrl university")
  );
  res.json({ publications });
}

export async function getPublication(req: Request, res: Response) {
  const publication = await Publication.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { "metrics.views": 1 } },
    { new: true }
  ).populate("owner", "name username avatarUrl university bio skills socialLinks");
  if (!publication) throw new ApiError(404, "Publication not found");
  res.json({ publication });
}

export async function updatePublicationStatus(req: AuthRequest, res: Response) {
  const publication = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!publication) throw new ApiError(404, "Publication not found");
  res.json({ publication });
}
