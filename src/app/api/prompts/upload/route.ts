import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUploadUrl } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    const decoded = verifyToken(token!);
    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, contentType } = await req.json();
    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    const s3Key = `${decoded.userId}/${Date.now()}-${fileName}`;
    const uploadUrl = await getUploadUrl(s3Key, contentType);

    return NextResponse.json({ uploadUrl, s3Key });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
