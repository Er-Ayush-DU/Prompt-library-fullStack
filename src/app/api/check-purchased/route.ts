// app/api/check-purchased/route.ts
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
    const purchased = await Purchase.findOne({ userId, promptId });

    return NextResponse.json({ purchased: !!purchased });
  } catch (err: any) {
    return NextResponse.json({ purchased: false, error: err.message }, { status: 500 });
  }
}