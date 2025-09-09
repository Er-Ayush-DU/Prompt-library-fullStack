"use client";

import { useEffect, useState } from "react";
import PromptCard from "@/components/PromptCard";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchPrompts = async () => {
        try {
          const res = await fetch(`/api/dashboard?userId=${session.user.id}`);
          const data = await res.json();
          setPrompts(data.prompts || []);
        } catch (error) {
          console.error("Error fetching prompts:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPrompts();
    } else {
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  if (loading) return <p className="container mx-auto p-4">Loading...</p>;
  if (status !== "authenticated") return <p className="container mx-auto p-4">Please sign in</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Prompts Dashboard</h2>
      {prompts.length === 0 ? (
        <p>No prompts uploaded yet.</p>
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