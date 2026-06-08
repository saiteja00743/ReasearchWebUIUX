/**
 * Vercel Serverless Entry Point
 *
 * Vercel invokes this file as a serverless function — it does NOT support
 * `app.listen()`. Instead, we export the Express app as the default export
 * and Vercel wraps it in its own HTTP runtime.
 *
 * Database connection is established lazily (once per cold start) so that
 * failed/missing env vars are reported in function logs rather than crashing
 * silently during module initialisation.
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { createApp } from "../src/app.js";

// ── Lazy database connection (survives cold starts) ──────────────────────────
let dbConnected = false;

async function ensureDbConnected(): Promise<void> {
  if (dbConnected || mongoose.connection.readyState === 1) {
    dbConnected = true;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is not set. " +
        "Add it in Vercel → Project → Settings → Environment Variables."
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  dbConnected = true;
  console.log("[vercel] MongoDB connected");
}

// ── Build the Express app ────────────────────────────────────────────────────
const app = createApp();

// ── Serverless handler ───────────────────────────────────────────────────────
// Vercel calls this for every inbound request.  We wrap the normal Express
// `handle` method so we can lazily connect to the database on the first cold
// start without blocking module initialisation.
const handler = async (
  req: import("http").IncomingMessage,
  res: import("http").ServerResponse
): Promise<void> => {
  try {
    await ensureDbConnected();
  } catch (err) {
    console.error("[vercel] DB connection failed:", err);
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Service Unavailable",
        message: "Database connection failed. Check server logs.",
      })
    );
    return;
  }

  // Delegate to Express
  (app as any)(req, res);
};

export default handler;
