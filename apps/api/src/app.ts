import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error-handler.js";
import { apiLimiter } from "./middleware/rate-limit.js";
import { adminRouter } from "./routes/admin.routes.js";
import { aiRouter } from "./routes/ai.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { publicationRouter } from "./routes/publication.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { userRouter } from "./routes/user.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.APP_URL, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use("/api/v1", apiLimiter);

  app.get("/health", (_req, res) => res.json({ ok: true, service: "researchhub-api" }));
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/publications", publicationRouter);
  app.use("/api/v1/uploads", uploadRouter);
  app.use("/api/v1/ai", aiRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use(errorHandler);

  return app;
}
