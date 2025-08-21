"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPromptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", tags: "", price: 0 });

  useEffect(() => {
    fetch(`/api/prompts/${id}/get`)
      .then((res) => res.json())
      .then((data) => setForm({ ...data, tags: data.tags.join(", ") }));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/prompts/${id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: form.tags.split(",").map((t) => t.trim()) }),
    });
    router.push(`/prompts/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Prompt</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-gray-700" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-gray-700" />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-2 rounded bg-gray-700" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 rounded bg-gray-700" />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}
