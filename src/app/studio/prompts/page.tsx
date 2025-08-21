"use client";
import { useEffect, useState } from "react";

export default function MyPromptsPage() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetch("/api/prompts?my=true") // API will return only logged-in user's prompts
      .then((res) => res.json())
      .then((data) => setPrompts(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Prompts</h1>
      <table className="w-full bg-white text-black shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Likes</th>
            <th className="p-2">Comments</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((p: any) => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.likesCount}</td>
              <td className="p-2">{p.commentsCount}</td>
              <td className="p-2 flex gap-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
