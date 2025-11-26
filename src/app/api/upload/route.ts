// import { NextRequest, NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import Prompt from "@/models/promptModel/prompt";
// import { getServerSession } from "next-auth";
// import { authOption } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();

//     // 🔑 Get session user
//     const session = await getServerSession(authOption);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const userId = session.user.id;

//     // 📨 Read JSON body
//     const { title, description, category, tags, price, s3Key, contentType } = await req.json();

//     // ⚠️ Validation
//     if (!title || !description || !category || !s3Key || !contentType) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // 💾 Save to DB
//     const prompt = new Prompt({
//       title,
//       description,
//       category,
//       tags,
//       price,
//       createdBy: userId,
//       s3Key,
//       contentType,
//       previewUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${s3Key}`,
//       likesCount: 0,
//       commentsCount: 0,
//       isForSale: price > 0,
//     });
//     // console.log("Saving prompt:", prompt);                          

//     await prompt.save();

//     return NextResponse.json({ message: "Prompt uploaded successfully", prompt }, { status: 201 });
//   } catch (error) {
//     console.error("Upload API error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOption);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { title, description, category, tags, price, s3Key, contentType } =
      await req.json();

    if (!title || !description || !category || !s3Key || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = new Prompt({
      title,
      description,
      category,
      tags,
      price,
      createdBy: userId,
      s3Key,
      contentType,
      previewUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
      likesCount: 0,
      commentsCount: 0,
      isForSale: price > 0,
    });

    await prompt.save();

    return NextResponse.json(
      { message: "Uploaded successfully", prompt },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
