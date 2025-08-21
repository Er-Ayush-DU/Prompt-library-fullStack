import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    promptId: { 
      type: Schema.Types.ObjectId, 
      ref: "Prompt", 
      required: true, 
      index: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    comment: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 1000 
    },
    createdAt: { 
      type: Date, 
      default: Date.now, 
      immutable: true 
    },
  },
  {                                                }
);

// Index optimization (prompt + user)
CommentSchema.index({ promptId: 1, userId: 1 });

export default models.Comment || model("Comment", CommentSchema);
