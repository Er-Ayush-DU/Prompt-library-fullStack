import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Like from "@/models/likeModel/likes";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { postId, userId } = await req.json();

  if (!postId || !userId) {
    return NextResponse.json({ error: "postId and userId are required" }, { status: 400 });
  }

  const existingLike = await Like.findOne({ postId, userId });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return NextResponse.json({ message: "Like removed" }, { status: 200 });
  }

  const like = new Like({ postId, userId });
  await like.save();
  return NextResponse.json({ message: "Like added" }, { status: 201 });
}