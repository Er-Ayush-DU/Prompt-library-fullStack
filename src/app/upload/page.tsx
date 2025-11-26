"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState(mode === "sell" ? "49" : "0");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // File preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Please sign in to upload");
      return;
    }
    if (!title || !description || !category || !file || !tags) {
      setError("All fields are required");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      // 1. Get Signed URL
      const presignRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, s3Key } = await presignRes.json();

      // 2. Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (uploadRes.status !== 200) {
        const err = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }

      // 3. Save to DB
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          tags: tags.split(",").map((t: string) => t.trim()),
          price: parseInt(price),
          s3Key,
          contentType: file.type,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Prompt uploaded successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err: any) {
        setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading") return <LoaderScreen />;
  if (status !== "authenticated") return <AuthPrompt />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            {mode === "sell" ? "Sell Your Masterpiece" : "Share Your Art"}
          </h1>
          <p className="text-purple-200 text-lg">
            {mode === "sell" ? "Turn your AI creations into income" : "Inspire the world with your prompts"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload - Premium Drop Zone */}
          <div className="relative">
            <label className="block text-sm font-medium text-purple-300 mb-3">Upload Preview</label>
            <div className="group relative">
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500">
                  <img src={preview} alt="Preview" className="w-full h-80 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-80 border-3 border-dashed border-purple-500 rounded-2xl cursor-pointer bg-gradient-to-br from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 transition-all duration-300 group"
                >
                  <Upload className="w-16 h-16 text-purple-400 mb-4 group-hover:scale-110 transition" />
                  <p className="text-xl font-semibold text-white">Drop your file here</p>
                  <p className="text-sm text-purple-300 mt-2">or click to browse</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cyberpunk City at Midnight"
              className="w-full px-5 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Prompt Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your AI masterpiece..."
              rows={5}
              className="w-full px-5 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
              required
            />
          </div>

          {/* Category & Tags */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="" className="bg-gray-900">Select Category</option>
                {[
                  "Image", "Video", "Audio", "Clips", "Games", 
                  "Web Apps", "UI Design", "Other"
                ].map(cat => (
                  <option key={cat} value={cat.toLowerCase().replace(" ", "_")} className="bg-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="cyberpunk, neon, futuristic..."
                className="w-full px-5 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Price (Only for Sell) */}
          {mode === "sell" && (
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Price (₹)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-purple-400">₹</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="10"
                  className="w-full pl-12 pr-5 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-300 flex items-center gap-3">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 bg-green-900/50 border border-green-500 rounded-xl text-green-300 flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text l-lg rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                {mode === "sell" ? "Sell This Prompt" : "Upload Prompt"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Helper Components
function LoaderScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}

function AuthPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md">
        <h2 className="text-3xl font-bold text-white mb-4">Sign In Required</h2>
        <p className="text-purple-200 mb-6">Please sign in to upload your prompts</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<LoaderScreen />}>
      <UploadContent />
    </Suspense>
  );
}