import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/userModel/user";
import { dbConnect } from "@/lib/db";

export async function GET() {
  await dbConnect();
  const user = await User.findOne({ email: "er.ayush336@gmail.com" });

  const result = await bcrypt.compare("123456789", user?.password || "");

  return NextResponse.json({
    passwordInDb: user?.password,
    compareResult: result,
  });
}
