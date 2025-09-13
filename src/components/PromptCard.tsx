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
  const { status } = useSession();

  console.log("PromptCard session:", session);

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

  const handlePurchase = () => {
    if (status !== "authenticated") {
      alert("Please sign in to purchase");
      return;
    }
    // Add purchase logic (e.g., redirect to payment)
    console.log("Purchase prompt:", prompt._id);
  };

  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg">
      
      <img src={prompt.previewUrl} alt={prompt.title} className="w-full h-48 object-cover mb-2 rounded" />
      <h2 className="text-xl font-semibold">{prompt.title}</h2>
      <p className="text-gray-600 text-sm">{prompt.description.slice(0, 100)}...</p>
      <p>Price: ${prompt.price}</p>
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="text-red-500 hover:text-red-700"
        >
          ❤️ {likes}
        </button>
        <button
          onClick={() => handleComment("Nice prompt!")}
          className="text-blue-500 hover:text-blue-700"
        >
          💬 {comments}
        </button>
        {prompt.price > 0 && (
          <button
            onClick={handlePurchase}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Buy
          </button>
        )}
        {session?.user?.id === prompt.createdBy && (
          <span className="text-green-500">Selling</span>
        )}
      </div>
    </div>
  );
}