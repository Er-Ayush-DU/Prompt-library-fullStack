// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

const imageRegex = /\.(png|jpe?g|webp|gif|svg)$/i;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ prompts: [] });
    }

    const prompts = await Prompt.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Filter only image previews
    const filtered = prompts.filter(
      (p: any) => p.previewUrl && imageRegex.test(p.previewUrl)
    );

    return NextResponse.json({ prompts: filtered });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ prompts: [] }, { status: 500 });
  }
}