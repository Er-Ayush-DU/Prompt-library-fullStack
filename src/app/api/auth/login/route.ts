import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/userModel/user";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, password, action, newPassword, token } = await req.json();

    await dbConnect();

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and Password are required" },
          { status: 400 }
        );
      }

      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      return NextResponse.json(
        {
          message: "Login successful",
          user: { id: user._id, name: user.name, email: user.email },
        },
        { status: 200 }
      );
    }

    if (action === "reset") {
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: "No user found with this email" },
          { status: 404 }
        );
      }

      const resetToken = uuidv4();
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
      console.log("Token saved for:", user.email, "Token:", resetToken); // Debug

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`,
      });

      return NextResponse.json(
        { message: "Password reset link has been sent to your email" },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}