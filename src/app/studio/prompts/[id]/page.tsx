"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PromptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/prompts/${id}/get`)
      .then((res) => res.json())
      .then((data) => setPrompt(data));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this prompt?")) return;
    await fetch(`/api/prompts/${id}/delete`, { method: "DELETE" });
    router.push("/prompts");
  };

  if (!prompt) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-800 text-white rounded">
      <img src={prompt.previewUrl} alt={prompt.title} className="w-full rounded" />
      <h1 className="text-2xl font-bold mt-4">{prompt.title}</h1>
      <p>{prompt.description}</p>
      <p className="text-sm mt-2">Tags: {prompt.tags.join(", ")}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => router.push(`/prompts/${id}/edit`)} className="bg-yellow-500 px-4 py-2 rounded">Edit</button>
        <button onClick={handleDelete} className="bg-red-500 px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
}
