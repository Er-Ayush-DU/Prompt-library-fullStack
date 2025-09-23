import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Purchase from "@/models/purchaseModel/purchase";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, promptId, paymentDetails } = await req.json();

    // Convert to ObjectId to ensure matching
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const promptObjectId = new mongoose.Types.ObjectId(promptId);

    // Check if already purchased
    const existing = await Purchase.findOne({ userId: userObjectId, promptId: promptObjectId });
    if (existing) {
      return NextResponse.json({ success: true, already: true, purchased: true });
    }

    const newPurchase = await Purchase.create({
      userId: userObjectId,
      promptId: promptObjectId,
      paymentDetails,
    });

    return NextResponse.json({ success: true, purchased: true, purchase: newPurchase });
  } catch (err: any) {
    console.error("Save purchase error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
