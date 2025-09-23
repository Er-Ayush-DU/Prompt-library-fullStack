"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface PromptCardProps {
  prompt: any;
  session: any | null;
}

export default function PromptCard({ prompt, session }: PromptCardProps) {
  const [likes, setLikes] = useState(prompt.likesCount || 0);
  const [comments, setComments] = useState(prompt.commentsCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // ✅ track purchase
  const { status } = useSession();

  // Check if user has already purchased this prompt
  useEffect(() => {
    const checkPurchase = async () => {
      if (!session) return;
      try {
        const res = await fetch(
          `/api/check-purchased?promptId=${prompt._id}&userId=${session.user.id}`
        );
        if (!res.ok) throw new Error("Failed to check purchase");

        const data = await res.json();
        setIsPurchased(data.purchased);
      } catch (err) {
        console.error("Check purchase error:", err);
      }
    };
    checkPurchase();
  }, [session, prompt._id]);

  // console.log("PromptCard rendering:", prompt._id, "isPurchased:", isPurchased);



  const handleLike = async () => {
    if (status !== "authenticated" || isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt._id, userId: session?.user?.id }),
      });
      if (res.ok) setLikes(likes + 1);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (comment: string) => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch(`/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt._id, userId: session?.user?.id, comment }),
      });
      if (res.ok) setComments(comments + 1);
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  const handlePurchase = async () => {
    if (status !== "authenticated") {
      alert("Please sign in to purchase");
      return;
    }

    try {
      // 1️⃣ Create order from backend
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: prompt.price, currency: "INR" }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error("Order not created");

      // 2️⃣ Open Razorpay checkout
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: prompt.price * 100,
        currency: "INR",
        name: "Prompt Store",
        description: prompt.title,
        order_id: data.orderId,
        handler: async function (response: any) {
          alert("Payment Successful ✅");
          // console.log("Payment response:", response);

          // 3️⃣ Save purchased prompt for current user
          try {
            await fetch("/api/save-purchased", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: session?.user?.id,
                promptId: prompt._id,
                paymentDetails: response,
              }),
            });
            setIsPurchased(true); // ✅ hide Buy button
          } catch (err) {
            console.error("Error saving purchased prompt:", err);
          }
        },
        prefill: {
          name: session?.user?.name || "Test User",
          email: session?.user?.email || "test@example.com",
        },
        theme: { color: "#10B981" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="w-[180px] sm:w-[220px] md:w-[240px] rounded-lg bg-white shadow hover:shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <div className="aspect-[16/9] w-full">
        <img
          src={prompt.previewUrl}
          alt={prompt.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="text-black font-semibold line-clamp-1">{prompt.title}</h2>
        <p className="text-gray-600 text-xs line-clamp-2">
          {prompt.description.slice(0, 100)}
        </p>
        <p className="text-sm text-gray-800 font-medium mt-1">Price: ₹{prompt.price}</p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ❤️ {likes}
          </button>
          <button
            onClick={() => handleComment("Nice prompt!")}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            💬 {comments}
          </button>

          {prompt.price > 0 && !isPurchased && ( // ✅ hide Buy if purchased
            <button
              onClick={handlePurchase}
              className="ml-auto bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 cursor-pointer"
            >
              Buy
            </button>
          )}

          {isPurchased && (
            <span className="ml-auto text-green-600 font-semibold text-xs">
              Purchased
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
