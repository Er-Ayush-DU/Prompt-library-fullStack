import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" }; // case-insensitive search
    }
    if (category) {
      query.category = category;
    }

    const prompts = await Prompt.find(query)
      .populate("createdBy", "name avatarUrl")
      .sort({ createdAt: -1 });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}
