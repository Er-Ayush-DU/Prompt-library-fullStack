import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/userModel/user";
import bcrypt from "bcryptjs";
// import { signJWT, setAuthCookie } from "@/lib/auth"; // (agar JWT / cookie chahiye to uncomment)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // validate
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required" },
        { status: 400 }
      );
    }

    // connect to db
    await dbConnect();

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 402 }
      );
    }

    // (Optional: JWT / Cookie)
    // const token = signJWT({ id: user._id.toString() });
    // setAuthCookie(token);

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
