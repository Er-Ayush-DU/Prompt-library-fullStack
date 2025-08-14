"use client";
import { useState } from "react";

export default function UploadPromptPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "image",
    tags: "",
    price: 0,
    modifiedAfterGeneration: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    // Step 1: Get S3 Upload URL
    const uploadRes = await fetch("/api/prompts/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    });
    const { uploadUrl, s3Key } = await uploadRes.json();

    // Step 2: Upload file to S3
    await fetch(uploadUrl, { method: "PUT", body: file });

    const previewUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${s3Key}`;

    // Step 3: Create Prompt
    await fetch("/api/prompts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
        contentType: file.type,
        s3Key,
        previewUrl,
      }),
    });

    alert("Prompt uploaded successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded">
      <h1 className="text-2xl font-bold mb-4">Upload Prompt</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-gray-700" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-gray-700" />
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded bg-gray-700">
          <option value="image">Image</option>
          <option value="video_noaudio">Video (No Audio)</option>
          <option value="video_audio">Video (With Audio)</option>
          <option value="audio">Audio</option>
          <option value="webapp">Web App</option>
          <option value="mobileapp">Mobile App</option>
          <option value="webgame">Web Game</option>
          <option value="ui_design">UI Design</option>
          <option value="text">Text</option>
        </select>
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-2 rounded bg-gray-700" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 rounded bg-gray-700" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="modifiedAfterGeneration" checked={form.modifiedAfterGeneration} onChange={handleChange} /> Modified after generation?
        </label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  );
}
