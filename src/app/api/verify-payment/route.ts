// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Purchase from "@/models/purchaseModel/purchase";

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, promptId, userId , amount } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected === razorpay_signature) {
    await Purchase.create({ userId, promptId, paymentId: razorpay_payment_id, orderId: razorpay_order_id, amount,});
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}