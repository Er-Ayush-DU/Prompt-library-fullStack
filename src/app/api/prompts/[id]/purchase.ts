import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { userId } = await req.json();
  const promptId = params.id;

  try {
    const prompt = await Prompt.findById(promptId);
    if (!prompt) return NextResponse.json({ error: "Prompt not found" }, { status: 404 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(prompt.price * 100),
      currency: "usd",
      description: `Purchase of ${prompt.title}`,
    });

    return NextResponse.json({ checkoutUrl: paymentIntent.client_secret }, { status: 200 });
  } catch (error) {
    console.error("Purchase API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}