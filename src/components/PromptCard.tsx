"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface PromptCardProps {
  prompt: any;
  session: any | null;
}

export default function PromptCard({ prompt, session }: PromptCardProps) {
  const [likes, setLikes] = useState(prompt.likesCount || 0);
  const [comments, setComments] = useState(prompt.commentsCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (!session) return;
    const checkPurchase = async () => {
      try {
        const res = await fetch(`/api/check-purchased?promptId=${prompt._id}&userId=${session.user.id}`);
        const data = await res.json();
        setIsPurchased(data.purchased);
      } catch (err) { }
    };
    checkPurchase();
  }, [session, prompt._id]);

  const handleLike = async () => {
    if (status !== "authenticated" || isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt._id, userId: session?.user?.id }),
      });
      if (res.ok) setLikes(likes + 1);
    } catch (error) { } finally {
      setIsLiking(false);
    }
  };

  const handlePurchase = async () => {
    if (status !== "authenticated") {
      alert("Please sign in to purchase this prompt.");
      return;
    }

    try {
      // 1. Create Order on Backend
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: prompt.price,
          currency: "INR",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.orderId) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Open Razorpay Checkout
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: prompt.price * 100,
        currency: "INR",
        name: "Prompt Library",
        description: prompt.title,
        image: "/logo.png", // optional
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment & Save Purchase
            const verifyRes = await fetch("/api/save-purchased", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: session.user.id,
                promptId: prompt._id,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setIsPurchased(true);
              alert("Payment successful! Prompt purchased.");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Save purchase error:", err);
            alert("Something went wrong. Try again.");
          }
        },
        prefill: {
          name: session.user.name || "",
          email: session.user.email || "",
        },
        theme: { color: "#10B981" },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Razorpay error:", error);
      alert("Payment failed: " + error.message);
    }
  };

  return (
    <div className="group relative bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
      {/* Image */}
      <div className="relative aspect-auto">
        <Image
          src={prompt.previewUrl}
          alt={prompt.title}
          width={400}
          height={600}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handlePurchase}
      >
        <h3 className="font-bold text-lg line-clamp-1">{prompt.title}</h3>
        <p className="text-sm opacity-90 line-clamp-2 mb-2">{prompt.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className="flex items-center gap-1 hover:scale-110 transition">
              <span>❤️</span> <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:scale-110 transition">
              <span>💬</span> <span>{comments}</span>
            </button>
            <button>
              <span>👤 {prompt.creator?.username || "artist"}</span>
            </button>
          </div>
          {prompt.price > 0 && !isPurchased && (
            <button
              // onClick={handlePurchase}
              className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100"
            >
              ₹{prompt.price}
            </button>
          )}
          {isPurchased && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Owned</span>}
        </div>
      </div>

      {/* Footer (Always Visible) */}
      {/* <div className="p-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">@{prompt.creator?.username || "artist"}</span>
          <span className="text-gray-400">AI Art</span>
        </div>
      </div> */}
    </div>
  );
}