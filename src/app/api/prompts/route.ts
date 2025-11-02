
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

// YE LINE ADD KARO — IMAGE FILTER
const imageRegex = /\.(png|jpe?g|webp|gif|svg)$/i;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Fetch all prompts
    const prompts = await Prompt.find().lean();

    // 2. FILTER ONLY IMAGE PREVIEWS (PDF, DOCX hatao)
    const filteredPrompts = prompts.filter((p: any) =>
      p.previewUrl && imageRegex.test(p.previewUrl)
    );

    // 3. Return filtered data
    return NextResponse.json({ prompts: filteredPrompts }, { status: 200 });
  } catch (error) {
    console.error("Prompts API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}