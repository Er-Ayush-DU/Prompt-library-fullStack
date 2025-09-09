"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Upload() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState(mode === "sell" ? "10" : "0");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Please sign in to upload prompts");
      return;
    }
    if (!title || !description || !category || !file || !tags) {
      setError("All fields are required");
      return;
    }

    try {
      // 1️⃣ Get Signed URL from backend
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

      // 2️⃣ Upload file to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // 3️⃣ Save metadata to DB
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          tags: tags.split(","),
          price,
          s3Key,
          contentType: file.type,
        }),
      });
      console.log("Upload response:", res);

      const data = await res.json();
      if (res.ok) {
        setMessage("Prompt uploaded successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.error || "Failed to upload prompt");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Something went wrong while uploading");
    }
  };

  if (status === "loading") return <p className="container mx-auto p-4">Loading...</p>;
  if (status !== "authenticated") return <p className="container mx-auto p-4">Please sign in to upload</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{mode === "sell" ? "Sell a Prompt" : "Upload Prompt"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded h-32" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded bg-black">
          <option value="">Select Category</option>
          <option value="image">Image</option>
          <option value="video_noaudio">Video</option>
          <option value="audio">Audio</option>
          <option value="clips">Clips</option>
          <option value="games">Games</option>
          <option value="webapps">Web apps</option>
          <option value="ui_design">UI design</option>
          <option value="other">Other</option>
        </select>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="w-full p-2 border rounded" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded" required={mode === "sell"} />
        <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 border rounded" />
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer">
          {mode === "sell" ? "Sell Prompt" : "Upload"}
        </button>
      </form>
    </div>
  );
}
