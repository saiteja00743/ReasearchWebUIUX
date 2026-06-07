import mongoose, { Schema } from "mongoose";

const interactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    publication: { type: Schema.Types.ObjectId, ref: "Publication", required: true, index: true },
    type: { type: String, enum: ["like", "bookmark", "download", "share", "view"], required: true, index: true }
  },
  { timestamps: true }
);

interactionSchema.index({ user: 1, publication: 1, type: 1 }, { unique: true });

export const Interaction = mongoose.model("Interaction", interactionSchema);
