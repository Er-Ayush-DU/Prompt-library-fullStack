"use client";

import { useState, useEffect } from "react";

export default function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const userId = "user123"; // Replace with actual logged-in user ID

  useEffect(() => {
    // Fetch initial likes (simulated)
    setLikes(10); // Replace with API call later
  }, [postId]);

  const handleLike = async () => {
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId }),
    });
    const data = await res.json();
    if (data.message === "Like added") {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
}