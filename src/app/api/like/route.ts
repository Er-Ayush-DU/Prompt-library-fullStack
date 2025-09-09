import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { promptId, userId } = await req.json();
    const prompt = await Prompt.findById(promptId);
    if (prompt) prompt.likesCount += 1;
    await prompt?.save();
    return NextResponse.json({ message: "Liked" }, { status: 200 });
  } catch (error) {
    console.error("Like API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}