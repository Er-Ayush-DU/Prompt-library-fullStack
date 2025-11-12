// app/prompt/[id]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { Heart, MessageCircle, Download, ShoppingCart, ArrowLeft, Lock, CheckCircle } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) return { title: "Prompt Not Found" };

  return {
    title: `${prompt.title} - Prompt Library`,
    description: prompt.isPurchased ? prompt.description : "Unlock this premium AI prompt",
    openGraph: {
      title: prompt.title,
      description: prompt.isPurchased ? prompt.description : "Premium AI Prompt - Buy to Unlock",
      images: prompt.previewUrl,
    },
  };
}

async function getPrompt(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/prompts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();

  const session = await getServerSession(authOption);

  // 1. isPurchased check
  let isPurchased = false;
  if (session?.user?.id) {
    const purchaseRes = await fetch(
      `${baseUrl}/api/check-purchased?promptId=${id}&userId=${session.user.id}`
    );
    if (purchaseRes.ok) {
      const purchaseData = await purchaseRes.json();
      isPurchased = purchaseData.purchased || false;
    }
  }

  // 2. isOwner check — CORRECT STRING COMPARISON
  const isOwner = session?.user?.id && data.createdBy 
    ? String(session.user.id) === String(data.createdBy)
    : false;

  // 3. Attach to data
  data.isPurchased = isPurchased;
  data.isOwner = isOwner;

  return data;
}

export default async function PromptDetail({ params }: Props) {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) notFound();

  const session = await getServerSession(authOption);
  const isOwner = prompt.isOwner;
  const isPurchased = prompt.isPurchased;
  const isFree = prompt.price === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span>Back to Gallery</span>
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 grid lg:grid-cols-2 gap-12 max-w-7xl">
        {/* LEFT: IMAGE */}
        <div className="relative group">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30">
            <Image
              src={prompt.previewUrl}
              alt={prompt.title}
              width={1000}
              height={1000}
              className={`w-full h-auto object-cover transition-all duration-700 ${!isPurchased && !isFree ? "blur-sm" : ""
                } group-hover:scale-105`}
              unoptimized
              priority
            />
            {!isPurchased && !isFree && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Lock className="w-16 h-16 text-purple-400" />
              </div>
            )}
          </div>

          {/* Price Badge */}
          {prompt.price > 0 && (
            <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-2 rounded-full font-bold text-lg shadow-xl flex items-center gap-1">
              ₹{prompt.price}
            </div>
          )}
          {isFree && (
            <div className="absolute top-6 right-6 bg-green-600 text-white px-5 py-2 rounded-full font-bold text-lg shadow-xl">
              FREE
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              {prompt.title}
            </h1>

            {/* Prompt Text - HIDDEN UNTIL PURCHASED */}
            {isPurchased || isFree || isOwner ? (
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30">
                <p className="text-lg leading-relaxed text-gray-100 whitespace-pre-wrap">
                  {prompt.description}
                </p>
              </div>
            ) : (
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/20">
                <p className="text-lg text-gray-400 italic">
                  <Lock className="inline w-5 h-5 mr-2" />
                  Purchase to unlock the full prompt
                </p>
              </div>
            )}
          </div>

          {/* Creator */}
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-lg font-bold">
                {prompt.creator?.username?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
            <div>
              <p className="text-xl font-bold">@{prompt.creator?.username || "artist"}</p>
              <p className="text-sm text-purple-300">AI Creator</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-purple-500/20 text-center">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{prompt.likesCount || 0}</p>
              <p className="text-sm text-gray-400">Likes</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-purple-500/20 text-center">
              <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{prompt.commentsCount || 0}</p>
              <p className="text-sm text-gray-400">Comments</p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {prompt.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/50 to-pink-600/50 backdrop-blur-sm rounded-full text-sm font-medium border border-purple-500/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            {isOwner ? (
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-center text-lg shadow-xl flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                You Own This Prompt
              </div>
            ) : isPurchased ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-center text-lg shadow-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Purchased Successfully!
                </div>
                <a
                  href={prompt.previewUrl}
                  download
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl"
                >
                  <Download className="w-6 h-6" />
                  Download Image
                </a>
              </div>
            ) : isFree ? (
              <a
                href={prompt.previewUrl}
                download
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl"
              >
                <Download className="w-6 h-6" />
                Download Free
              </a>
            ) : (
              <form action="/api/create-order" method="POST" className="w-full">
                <input type="hidden" name="promptId" value={prompt._id} />
                <input type="hidden" name="amount" value={prompt.price} />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Buy Now for ₹{prompt.price}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}