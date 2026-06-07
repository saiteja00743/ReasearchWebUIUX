import mongoose, { Schema } from "mongoose";

const publicationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    abstract: { type: String, required: true, maxlength: 5000 },
    summary: { type: String, maxlength: 3000 },
    keywords: [{ type: String, index: true }],
    tags: [{ type: String, index: true }],
    category: { type: String, required: true, index: true },
    authors: [
      {
        name: String,
        email: String,
        affiliation: String,
        user: { type: Schema.Types.ObjectId, ref: "User" }
      }
    ],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pdfUrl: { type: String, required: true },
    pdfPublicId: { type: String, required: true },
    coverImageUrl: String,
    coverImagePublicId: String,
    citation: String,
    status: {
      type: String,
      enum: ["draft", "in_review", "published", "rejected", "removed"],
      default: "draft",
      index: true
    },
    featuredUntil: Date,
    sponsoredBy: String,
    metrics: {
      views: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },
    publishedAt: Date,
    reviewedAt: Date,
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectionReason: String
  },
  { timestamps: true }
);

publicationSchema.index({ title: "text", abstract: "text", keywords: "text", tags: "text" });
publicationSchema.index({ status: 1, category: 1, publishedAt: -1 });
publicationSchema.index({ "metrics.views": -1, "metrics.downloads": -1 });

export const Publication = mongoose.model("Publication", publicationSchema);
