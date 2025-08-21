"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioUploadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "image",
    tags: "",
    price: 0,
    modifiedAfterGeneration: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Select a file first");
    setBusy(true);

    // 1) presigned URL
    const up = await fetch("/api/prompts/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    }).then(r => r.json());

    // 2) upload to S3
    await fetch(up.uploadUrl, { method: "PUT", body: file });

    // 3) create in DB
    const previewUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${up.s3Key}`;
    await fetch("/api/prompts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
        contentType: file.type,
        s3Key: up.s3Key,
        previewUrl,
      }),
    });

    setBusy(false);
    router.push("/studio/prompts");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Upload Prompt</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title"
               className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"/>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description"
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select name="category" value={form.category} onChange={handleChange}
                  className="rounded border px-3 py-2 bg-white dark:bg-gray-900">
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
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="tags: logo, 3d, noir"
                 className="rounded border px-3 py-2 bg-white dark:bg-gray-900"/>
          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price"
                 className="rounded border px-3 py-2 bg-white dark:bg-gray-900"/>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="modifiedAfterGeneration" checked={form.modifiedAfterGeneration} onChange={handleChange}/>
          Modified after generation?
        </label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button disabled={busy} className="rounded bg-blue-600 text-white px-4 py-2">
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
