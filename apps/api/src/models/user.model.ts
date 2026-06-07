import mongoose, { Schema } from "mongoose";
import type { UserRole } from "@researchhub/shared";

const socialLinkSchema = new Schema(
  {
    label: String,
    url: String
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["student", "reviewer", "admin"], default: "student" satisfies UserRole },
    avatarUrl: String,
    university: String,
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String, trim: true }],
    socialLinks: [socialLinkSchema],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    emailVerifiedAt: Date,
    verificationTokenHash: String,
    resetTokenHash: String,
    resetTokenExpiresAt: Date,
    lastLoginAt: Date
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
