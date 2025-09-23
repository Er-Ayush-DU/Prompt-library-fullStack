import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Purchase from "@/models/purchaseModel/purchase";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const promptId = url.searchParams.get("promptId");
    const userId = url.searchParams.get("userId");

    if (!promptId || !userId) {
      return NextResponse.json({ purchased: false });



    }

    await dbConnect();

    const purchased = await Purchase.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      promptId: new mongoose.Types.ObjectId(promptId),
    });
    // console.log(typeof userId, typeof promptId)
    console.log("All purchases for this user:", await Purchase.find({ userId }));
    console.log("promptId:", promptId, "userId:", userId, "purchased:", purchased);

    return NextResponse.json({ purchased: !!purchased });
  } catch (err: any) {
    console.error("Check purchase error:", err);
    return NextResponse.json({ purchased: false, error: err.message }, { status: 500 });
  }
}
