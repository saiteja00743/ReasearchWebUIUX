import type { Request, Response } from "express";
import { generateAbstract, generateCitation, generateKeywords, generateSummary } from "../services/ai.service.js";

export async function generateAiContent(req: Request, res: Response) {
  const { type, input, title, authors } = req.body;
  const result =
    type === "abstract"
      ? await generateAbstract(input)
      : type === "keywords"
        ? await generateKeywords(input)
        : type === "citation"
          ? await generateCitation({ title, authors })
          : await generateSummary(input);
  res.json({ result });
}
