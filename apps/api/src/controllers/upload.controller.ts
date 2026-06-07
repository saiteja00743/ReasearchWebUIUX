import type { Response } from "express";
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../middleware/error-handler.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function uploadAsset(req: AuthRequest, res: Response) {
  if (!req.file) throw new ApiError(400, "File is required");
  const isPdf = req.file.mimetype === "application/pdf";
  const folder = isPdf ? "researchhub/pdfs" : "researchhub/covers";
  const resourceType = isPdf ? "raw" : "image";

  const uploaded = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => (error || !result ? reject(error) : resolve(result))
    );
    stream.end(req.file!.buffer);
  });

  res.status(201).json({
    asset: {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      type: isPdf ? "pdf" : "image",
      bytes: uploaded.bytes
    }
  });
}
