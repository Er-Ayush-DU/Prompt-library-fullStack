"use client";

import { useEffect, useState } from "react";
import PromptCard from "@/components/PromptCard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch("/api/prompts");
        const data = await res.json();
        setPrompts(data.prompts || []);
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  if (loading) return <p className="container mx-auto p-4">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Prompts</h2>
      {prompts.length === 0 ? (
        <p>No prompts available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard key={prompt._id} prompt={prompt} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}