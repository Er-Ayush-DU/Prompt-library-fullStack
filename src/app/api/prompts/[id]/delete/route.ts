import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";
import { getUserFromCookies } from "@/lib/auth";
import { deleteFromS3 } from "@/lib/s3";

interface Params {
  params: { id: string };
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await dbConnect();
    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompt = await Prompt.findById(params.id);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    if (prompt.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // First delete from S3
    await deleteFromS3(prompt.s3Key);

    // Then delete from MongoDB
    await Prompt.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: "Prompt deleted" });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}
