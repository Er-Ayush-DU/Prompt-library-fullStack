// app/prompt/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { use } from "react"; // YE IMPORT ZARURI HAI
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  MessageCircle,
  Download,
  ArrowLeft,
  Lock,
  CheckCircle,
  Copy,
  Send,
} from "lucide-react";

export default function PromptDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // params ko unwrap karo

  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState<any>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // useEffect mein `id` use karo, `params.id` nahi
  useEffect(() => {
    const loadData = async () => {
      if (status === "loading" || !id) return;

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      try {
        // 1. FETCH PROMPT
        const res = await fetch(`${baseUrl}/api/prompts/${id}`, { cache: "no-store" });
        if (!res.ok) {
          console.error("Prompt API failed:", res.status);
          notFound();
          return;
        }

        const text = await res.text(); // Pehle text padho
        if (!text.trim()) {
          console.error("Empty response from /api/prompts");
          notFound();
          return;
        }

        let data;
        try {
          data = JSON.parse(text); // Manual parse
        } catch (err) {
          console.error("Invalid JSON:", text);
          notFound();
          return;
        }

        setPrompt(data.prompt || data);

        // 2. PURCHASE CHECK
        if (session?.user?.id) {
          const purchaseRes = await fetch(
            `${baseUrl}/api/check-purchased?promptId=${id}&userId=${session.user.id}`
          );
          if (purchaseRes.ok) {
            const purchaseData = await purchaseRes.json();
            setIsPurchased(purchaseData.purchased || false);
          }
        }

        // 3. LIKE CHECK
        if (session?.user?.id) {
          const likeRes = await fetch(
            `${baseUrl}/api/check-like?promptId=${id}&userId=${session.user.id}`
          );
          if (likeRes.ok) {
            const likeData = await likeRes.json();
            setIsLiked(likeData.liked || false);
          }
        }

        // 4. COMMENTS
        const commentRes = await fetch(`${baseUrl}/api/comments?promptId=${id}`);
        let commentData = { comments: [] };
        if (commentRes.ok) {
          const commentText = await commentRes.text();
          if (commentText.trim()) {
            try {
              commentData = JSON.parse(commentText);
            } catch (err) {
              console.warn("Invalid comment JSON");
            }
          }
        }
        setComments(commentData.comments || []);

        setLoading(false);
      } catch (err) {
        console.error("Load data error:", err);
        notFound();
      }
    };

    loadData();
  }, [id, session, status]); // params.id → id

  const toggleLike = async () => {
    if (status !== "authenticated" || !session?.user?.id) {
      alert("Please sign in to like");
      return;
    }

    const action = isLiked ? "unlike" : "like";
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: id, userId: session.user.id, action }),
    });

    if (res.ok) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || status !== "authenticated") {
      alert("Please sign in to comment");
      return;
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptId: id,
        userId: session?.user?.id,
        text: newComment,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setComments([data.comment, ...comments]);
      setNewComment("");
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt?.description || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!prompt) notFound();

  const isFree = prompt.price === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white">
      <div className="container mx-auto px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 grid lg:grid-cols-2 gap-12 max-w-7xl">
        {/* IMAGE */}
        <div className="relative group">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30">
            <Image
              src={prompt.previewUrl}
              alt={prompt.title}
              width={1000}
              height={1000}
              className={`w-full h-auto object-cover transition-all ${!isPurchased && !isFree ? "blur-sm" : ""} group-hover:scale-105`}
              unoptimized
            />
            {!isPurchased && !isFree && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Lock className="w-16 h-16 text-purple-400" />
              </div>
            )}
          </div>
          {prompt.price > 0 && (
            <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-2 rounded-full font-bold text-lg">
              ₹{prompt.price}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              {prompt.title}
            </h1>

            {(isPurchased || isFree || isOwner) ? (
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30">
                <div className="flex justify-between items-start">
                  <p className="text-lg text-gray-100 whitespace-pre-wrap">{prompt.description}</p>
                  <button onClick={copyPrompt} className="ml-4 p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white/5 rounded-2xl border border-purple-500/20">
                <p className="text-lg text-gray-400 italic">
                  <Lock className="inline w-5 h-5 mr-2" />
                  Purchase to unlock
                </p>
              </div>
            )}
          </div>

          {/* LIKE & COMMENT */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLike}
              disabled={status !== "authenticated"}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all ${isLiked
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              {likesCount} Likes
            </button>

            <div className="flex items-center gap-2 text-purple-300">
              <MessageCircle className="w-5 h-5" />
              {comments.length} Comments
            </div>
          </div>

          {/* COMMENT FORM */}
          <form onSubmit={addComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={status === "authenticated" ? "Add a comment..." : "Sign in to comment"}
              className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-purple-500/30 text-white placeholder-purple-300"
              disabled={status !== "authenticated"}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || status !== "authenticated"}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* COMMENTS LIST */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.map((c: any) => (
              <div key={c._id} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                  {c.user?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-sm">{c.user?.name || "User"}</p>
                  <p className="text-sm text-gray-300">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}