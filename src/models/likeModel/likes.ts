// models/Like.ts
import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema(
  {
    promptId: { 
      type: Schema.Types.ObjectId, 
      ref: "Prompt", 
      required: true, 
      index: true },

    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true },

    createdAt: { 
      type: Date, 
      default: Date.now, 
      immutable: true },
  },
  { versionKey: false } // __v field ko disable kar diya
);

// Prevent same user from liking the same prompt multiple times
LikeSchema.index({ promptId: 1, userId: 1 }, { unique: true });

export default models.Like || model("Like", LikeSchema);
