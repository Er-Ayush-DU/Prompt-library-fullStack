// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import PromptCard from "@/components/PromptCard";
import { Edit2, LogOut, Heart, ShoppingBag, Upload, User, Grid, Loader2 } from "lucide-react";

type Tab = "my-prompts" | "purchased" | "liked";

export default function ProfilePage() {
  const { data: session, status, update } = useSession(); // ← update added for session refresh
  const [activeTab, setActiveTab] = useState<Tab>("my-prompts");
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false); // ← New loading for upload

  // Load user data
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) return;

    setName(session.user.name || "");
    loadPrompts(activeTab);
  }, [status, session, activeTab]);

  const loadPrompts = async (tab: Tab) => {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    let endpoint = "";
    switch (tab) {
      case "my-prompts":
        endpoint = `/api/prompts?creator=${session?.user?.id}`;
        break;
      case "purchased":
        endpoint = `/api/my-purchases?userId=${session?.user?.id}`;
        break;
      case "liked":
        endpoint = `/api/like?userId=${session?.user?.id}`;
        break;
    }

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, { cache: "no-store" });
      const data = await res.json();
      setPrompts(data.prompts || data.purchases || data.likedPrompts || []);
    } catch (err) {
      console.error("Load prompts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!session?.user?.id) return;

    const formData = new FormData();
    formData.append("name", name);
    if (avatarFile) formData.append("avatar", avatarFile);

    setUploadLoading(true);
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const updatedData = await res.json();
        alert("Profile updated!");
        setEditing(false);

        // Update session with new data (no full refresh needed)
        await update({ avatarUrl: updatedData.avatarUrl || session.user.image, name });

        // Optional: full reload for safety
        window.location.reload();
      } else {
        const error = await res.json();
        alert("Update failed: " + error.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setUploadLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center">
          <p className="text-xl mb-4">Please sign in to view profile</p>
          <Link href="/api/auth/signin" className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white">
      {/* HERO PROFILE */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-900/50 to-transparent" />
        <div className="container mx-auto px-6 pt-32 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-4xl font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-500/50"
                />
              ) : (
                <h1 className="text-4xl font-extrabold">{session.user.name}</h1>
              )}
              <p className="text-purple-300 mt-1">@{session.user.email?.split("@")[0]}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => editing ? handleUpdateProfile() : setEditing(true)}
                disabled={uploadLoading}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {uploadLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    {editing ? "Save" : "Edit"}
                  </>
                )}
              </button>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-bold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center border border-purple-500/30">
            <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">{prompts.length}</p>
            <p className="text-sm text-purple-300">My Prompts</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center border border-purple-500/30">
            <ShoppingBag className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-purple-300">Purchased</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center border border-purple-500/30">
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">48</p>
            <p className="text-sm text-purple-300">Total Likes</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="container mx-auto px-6">
        <div className="flex gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full w-fit mx-auto mb-12">
          {(["my-prompts", "purchased", "liked"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-purple-300 hover:text-white"
                }`}
            >
              {tab === "my-prompts" && "My Prompts"}
              {tab === "purchased" && "Purchased"}
              {tab === "liked" && "Liked"}
            </button>
          ))}
        </div>

        {/* PROMPTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20">
            <Grid className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-xl text-purple-300">
              {activeTab === "my-prompts" && "You haven't created any prompts yet."}
              {activeTab === "purchased" && "You haven't purchased any prompts."}
              {activeTab === "liked" && "You haven't liked any prompts."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {prompts.map((prompt: any) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}