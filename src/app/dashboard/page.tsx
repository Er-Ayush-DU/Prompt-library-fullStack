"use client";

import { useEffect, useState } from "react";
import PromptCard from "@/components/PromptCard";
import { useSession } from "next-auth/react";
import Masonry from "react-masonry-css";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchPrompts = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
          const res = await fetch(`${baseUrl}/api/dashboard`, { cache: "no-store" });
          const data = await res.json();
          setPrompts(data.prompts || []);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPrompts();
    } else {
      setLoading(false);
    }
  }, [status]);

  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 4,
    1024: 3,
    768: 2,
    640: 1,
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;
  if (status !== "authenticated") return <p className="text-center py-20">Please sign in</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <a href="/upload" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg">
            + New Prompt
          </a>
        </div>
      </header>

      <main>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Creations</h2>

        {prompts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No prompts created yet.</p>
            <a href="/create" className="bg-green-600 text-white px-6 py-2 rounded-full">Create First</a>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto"
            columnClassName="bg-clip-padding"
          >
            {prompts.map((prompt) => (
              <div key={prompt._id}>
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </Masonry>
        )}
      </main>
    </div>
  );
}