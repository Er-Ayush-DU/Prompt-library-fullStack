import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const prompts = await Prompt.find(
      search
        ? { title: { $regex: search, $options: "i" } }
        : {}
    ).sort({ createdAt: -1 });

    return NextResponse.json(prompts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
