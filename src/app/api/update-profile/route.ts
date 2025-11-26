// app/api/update-profile/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import User from "@/models/userModel/user";
import { dbConnect } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const avatar = formData.get("avatar") as File;

    const updateData: { name: string; avatarUrl?: string } = { name };
    if (avatar && avatar.size > 0) {
      // Local upload for testing (create public/avatars folder)
      const fs = require("fs");
      const path = require("path");
      const filename = `avatars/${session.user.id}-${Date.now()}.jpg`;
      const filepath = path.join(process.cwd(), "public", filename);
      const buffer = Buffer.from(await avatar.arrayBuffer());
      fs.writeFileSync(filepath, buffer);
      updateData.avatarUrl = `/avatars/${filename}`;
    }

    await User.findByIdAndUpdate(session.user.id, updateData, { new: true });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}