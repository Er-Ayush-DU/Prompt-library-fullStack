import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Comment from "@/models/commentsModel/comments";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { postId, userId, content } = await req.json();

  if (!postId || !userId || !content) {
    return NextResponse.json({ error: "postId, userId, and content are required" }, { status: 400 });
  }

  const comment = new Comment({ postId, userId, content });
  await comment.save();
  return NextResponse.json({ message: "Comment added" }, { status: 201 });
}