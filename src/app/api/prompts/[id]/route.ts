import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params; // ✅ await
    const prompt = await Prompt.findById(id).lean();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    console.error("Prompt detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// Other methods (PUT, DELETE) can be added here as needed