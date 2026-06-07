import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    refreshTokenHash: { type: String, required: true, unique: true },
    userAgent: String,
    ipAddress: String,
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: Date
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
