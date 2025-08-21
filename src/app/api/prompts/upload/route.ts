import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { fileName, contentType } = await req.json();
    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
    }

    // Unique key in S3
    const fileKey = `prompts/${crypto.randomUUID()}-${fileName}`;

    // Create command for S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
      ContentType: contentType,
    });

    // Generate signed URL (valid for 60 seconds)
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ uploadUrl, s3Key: fileKey });
  } catch (error) {
    console.error("Error generating S3 upload URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
