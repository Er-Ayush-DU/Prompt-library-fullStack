import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const prompt = await Prompt.findById(params.id);
    if (!prompt) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(prompt);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
