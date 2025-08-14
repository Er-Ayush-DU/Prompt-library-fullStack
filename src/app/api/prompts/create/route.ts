import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    const decoded: any = verifyToken(token!);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, category, contentType, tags, price, s3Key, previewUrl, modifiedAfterGeneration } = body;

    await dbConnect();

    const prompt = await Prompt.create({
      title,
      description,
      category,
      contentType,
      tags,
      price,
      s3Key,
      previewUrl,
      createdBy: decoded.userId,
      modifiedAfterGeneration,
    });

    return NextResponse.json({ message: "Prompt created", prompt });
  } catch (err) {
    console.error("Create Prompt Error:", err);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}
