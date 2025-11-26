// app/api/comments/route.ts
import { NextRequest } from "next/server";
import Comment from "@/models/commentsModel/comments";
import Prompt from "@/models/promptModel/prompt";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { promptId, userId, text } = await req.json();

    // VALIDATE INPUTS
    if (!promptId || !userId || !text?.trim()) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // CONVERT TO ObjectId
    let promptObjectId, userObjectId;
    try {
      promptObjectId = new mongoose.Types.ObjectId(promptId);
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (e) {
      return Response.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // CREATE COMMENT
    const comment = await Comment.create({
      promptId: promptObjectId,
      user: userObjectId,
      text: text.trim(),
    });

    // POPULATE
    await comment.populate("user", "name image");

    // UPDATE PROMPT COUNT
    await Prompt.findByIdAndUpdate(promptId, { $inc: { commentsCount: 1 } });

    return Response.json({ comment }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/comments error:", error.message);
    return Response.json(
      { error: "Failed to add comment", details: error.message },
      { status: 500 }
    );
  }
}