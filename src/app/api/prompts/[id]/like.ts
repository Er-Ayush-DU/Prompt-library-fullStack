import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { userId } = await req.json();
  const promptId = params.id;

  try {
    const prompt = await Prompt.findById(promptId);
    if (!prompt) return NextResponse.json({ error: "Prompt not found" }, { status: 404 });

    prompt.likesCount += 1;
    await prompt.save();

    return NextResponse.json({ message: "Liked successfully" }, { status: 200 });
  } catch (error) {
    console.error("Like API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}