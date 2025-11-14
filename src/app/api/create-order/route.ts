// app/api/create-order/route.ts
import { NextRequest } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { promptId, amount } = await req.json();
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: promptId,
  });
  return Response.json(order);
}