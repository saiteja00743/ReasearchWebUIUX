import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  affiliation: z.string().optional()
});

export const publicationSchema = z.object({
  title: z.string().min(8).max(180),
  abstract: z.string().min(80).max(5000),
  keywords: z.array(z.string().min(2).max(40)).min(3).max(12),
  tags: z.array(z.string().min(2).max(30)).max(10).default([]),
  category: z.string().min(2),
  authors: z.array(authorSchema).min(1),
  pdfUrl: z.string().url(),
  pdfPublicId: z.string().min(3),
  coverImageUrl: z.string().url().optional(),
  coverImagePublicId: z.string().optional(),
  status: z.enum(["draft", "in_review"]).default("draft")
});
