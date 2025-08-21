import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prompt from "@/models/promptModel/prompt";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const me = await getUserFromCookies();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const match = { createdBy: me.id };

    const totalPrompts = await Prompt.countDocuments(match);
    const agg = await Prompt.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          likes: { $sum: "$likesCount" },
          comments: { $sum: "$commentsCount" },
          revenue: { $sum: "$price" }, // demo: replace with Orders sum if you add orders
        },
      },
    ]);

    const { likes = 0, comments = 0, revenue = 0 } = agg[0] || {};
    return NextResponse.json({ totalPrompts, totalLikes: likes, totalComments: comments, totalRevenue: revenue });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
