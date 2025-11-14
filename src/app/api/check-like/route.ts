// app/api/check-like/route.ts
import { NextRequest } from "next/server";
import Like from "@/models/likeModel/likes";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const promptId = searchParams.get("promptId");
  const userId = searchParams.get("userId");

  const like = await Like.findOne({ promptId, userId });
  return Response.json({ liked: !!like });
}