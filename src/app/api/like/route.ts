// app/api/like/route.ts
import { NextRequest } from "next/server";
import Like from "@/models/likeModel/likes";
import Prompt from "@/models/promptModel/prompt";

export async function POST(req: NextRequest) {
  try {
    const { promptId, userId, action } = await req.json();

    if (action === "like") {
      const existing = await Like.findOne({ promptId, userId });
      if (existing) return Response.json({ message: "Already liked" }, { status: 400 });

      await Like.create({ promptId, userId });
      await Prompt.findByIdAndUpdate(promptId, { $inc: { likesCount: 1 } });
    } else if (action === "unlike") {
      await Like.deleteOne({ promptId, userId });
      await Prompt.findByIdAndUpdate(promptId, { $inc: { likesCount: -1 } });
    }

    const prompt = await Prompt.findById(promptId);
    return Response.json({ likesCount: prompt.likesCount });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}