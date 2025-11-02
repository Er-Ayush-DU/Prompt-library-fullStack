import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";
import { getUserFromCookies } from "@/lib/auth";

// IMAGE EXTENSION CHECK
const imageRegex = /\.(png|jpe?g|webp|gif|svg)$/i;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      category,
      contentType,
      tags,
      price,
      s3Key,
      previewUrl,
      modifiedAfterGeneration
    } = await req.json();


    // REQUIRED FIELDS
    if (!title || !description || !category || !s3Key || !previewUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // IMAGE VALIDATION (previewUrl must end with image extension)
    if (!imageRegex.test(previewUrl)) {
      return NextResponse.json(
        { error: "previewUrl must be a valid image (png, jpg, webp, gif, svg)" },
        { status: 400 }
      );
    }


    // CREATE PROMPT
    const prompt = await Prompt.create({
      title,
      description,
      category,
      contentType,
      tags,
      price,
      createdBy: user.id,
      s3Key,
      previewUrl,
      modifiedAfterGeneration
    });

    return NextResponse.json({ success: true, prompt });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}
