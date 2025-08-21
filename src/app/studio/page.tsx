"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PromptsListPage() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetch("/api/prompts/getAll")
      .then((res) => res.json())
      .then((data) => setPrompts(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Prompts</h1>
      <Link href="/prompts/upload" className="bg-green-500 text-white px-4 py-2 rounded">+ Upload Prompt</Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {prompts.map((p: any) => (
          <div key={p._id} className="bg-gray-800 text-white p-4 rounded">
            <img src={p.previewUrl} alt={p.title} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{p.title}</h2>
            <p className="text-sm">{p.description}</p>
            <Link href={`/prompts/${p._id}`} className="text-blue-400 mt-2 block">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
