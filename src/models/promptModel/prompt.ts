import mongoose, { Schema, Document } from "mongoose";

export interface IPrompt extends Document {   
  title: string;
  description: string;
  category:
  | "image"
  | "video_noaudio"
  | "video_audio"
  | "audio"
  | "webapp"
  | "mobileapp"
  | "webgame"
  | "ui_design"
  | "text";
  contentType: string; // e.g. image/png, video/mp4
  tags: string[];
  price: number;
  createdBy: mongoose.Types.ObjectId;
  s3Key: string;
  previewUrl: string;
  likesCount: number;
  isForSale: boolean;
  commentsCount: number;
  modifiedAfterGeneration: boolean;
}

const PromptSchema: Schema = new Schema<IPrompt>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: [
        "image",
        "video_noaudio",
        "audio",
        "clips",
        "games",
        "webapps",
        "ui_design",
        "other",
      ],
    },
    contentType: { type: String, required: true }, // MIME type
    tags: { type: [String], default: [] },
    price: { type: Number, default: 0, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    s3Key: { type: String, required: true, unique: true },
    previewUrl: { type: String, required: true, default: '/default-avatar.png' },
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    isForSale: { type: Boolean, default: false },
    modifiedAfterGeneration: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Indexes for optimization (keep only schema-level indexes)
PromptSchema.index({ createdBy: 1 });
PromptSchema.index({ tags: 1 });

export default mongoose.models.Prompt || mongoose.model<IPrompt>("Prompt", PromptSchema);
