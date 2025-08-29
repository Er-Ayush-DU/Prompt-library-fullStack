"use client";

import { useState, useEffect } from "react";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const userId = "user123"; // Replace with actual logged-in user ID

  useEffect(() => {
    // Fetch comments (simulated)
    setComments(["Great post!", "Nice!"]); // Replace with API call later
  }, [postId]);

  const handleComment = async () => {
    if (!newComment) return;
    const res = await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId, content: newComment }),
    });
    const data = await res.json();
    if (data.message === "Comment added") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <ul className="list-disc pl-5 mt-2">
        {comments.map((comment, index) => (
          <li key={index} className="mb-2">{comment}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-2 border rounded mt-2"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleComment}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Post Comment
      </button>
    </div>
  );
}