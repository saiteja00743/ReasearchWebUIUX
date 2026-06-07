import type { ErrorRequestHandler } from "express";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof ApiError ? error.statusCode : 500;
  res.status(status).json({
    error: {
      message: error.message ?? "Unexpected server error",
      details: error instanceof ApiError ? error.details : undefined
    }
  });
};
