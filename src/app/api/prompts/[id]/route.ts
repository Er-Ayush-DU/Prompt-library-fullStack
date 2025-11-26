// app/api/prompts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

// YE SABSE ZAROORI HAI — HAR REQUEST PE DB CONNECT KARO
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect(); // YE LINE DAALNA ZAROORI HAI!!!

    const { id } = await params;

    // ID valid hai?
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const prompt = await Prompt.findById(id)
      .populate("createdBy", "name image username")
      .lean(); // .lean() → fast + plain object

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // YE LINE SABSE ZAROORI HAI → { prompt } return karo!!!
    return NextResponse.json({ prompt }, { status: 200 });

  } catch (error: any) {
    console.error("GET /api/prompts/[id] error:", error.message);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}