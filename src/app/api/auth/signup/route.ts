import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/userModel/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { err: "Name, Email, and Password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { err: "User already exists" },
        { status: 400 }
      );
    }
  
    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { err: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}