import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db"; // Path verify karo
import User from "@/models/userModel/user"; // Path verify karo
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    console.log("Found user:", user); // Debug log
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    try {
      await user.save();
      console.log("Password updated for user:", user.email);
    } catch (saveError) {
      console.error("Save error:", saveError);
      return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}