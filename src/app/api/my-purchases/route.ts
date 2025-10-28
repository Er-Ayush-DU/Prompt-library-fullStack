// app/api/my-purchases/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Purchase from "@/models/purchaseModel/purchase";
import Prompt from "@/models/promptModel/prompt";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const purchases = await Purchase.find({ userId: session.user.id })
      .populate({
        path: "promptId",
        model: Prompt,
        select: "title description price previewUrl"
      })
      .sort({ createdAt: -1 });

    const purchasedPrompts = purchases
      .filter(purchase => purchase.promptId)
      .map(purchase => ({
        _id: purchase.promptId._id.toString(),
        title: purchase.promptId.title,
        description: purchase.promptId.description,
        price: purchase.promptId.price,
        previewUrl: purchase.promptId.previewUrl,
        purchasedAt: purchase.createdAt
      }));

    return NextResponse.json({ 
      success: true, 
      purchases: purchasedPrompts 
    });
  } catch (err) {
    console.error("My purchases error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}