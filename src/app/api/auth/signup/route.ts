import { NextRequest , NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/userModel/user";
// import bcrypt from "bcrypt";
// import { signJWT, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest){
  try {
    const {name , email , password }  = await req.json();

    if(!name || !email || !password){
      return NextResponse.json(
        {err: "Name , Email and Password are required"},
        {status:400}
      )
    }
  await dbConnect();  

  const existingUser = await User.findOne({ email});
  if (existingUser){
    return NextResponse.json(
      {err: "User already exists"},
      {status:400}
    )
  }

  const user = await User.create({
    name,
    email,
    password
  })

  return NextResponse.json(
    {message: "User created successfully",
       user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
    },
    
    {status:201 }
  )

  } catch (error) {
    return NextResponse.json(
      {err: "Internal Server Error"},
      {status:500}
    )
  }


}

/*
  await dbConnect();
  const { name, email, password } = await req.json();
  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error:"Email exists" },{ status:409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signJWT({ id: user._id.toString() });
  setAuthCookie(token);
  return NextResponse.json({ id:user._id, name:user.name, email:user.email }, { status:201 });


*/