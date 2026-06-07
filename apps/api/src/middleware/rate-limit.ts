import rateLimit from "express-rate-limit";

const rateLimitFn = typeof rateLimit === "function" ? (rateLimit as any) : (rateLimit as any).default;

export const apiLimiter = rateLimitFn({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

export const authLimiter = rateLimitFn({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false
});
