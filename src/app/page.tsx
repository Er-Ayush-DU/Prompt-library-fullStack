"use client";

import { useEffect, useState } from "react";
import PromptCard from "@/components/PromptCard";
import { useSession } from "next-auth/react";
import Masonry from "react-masonry-css";

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
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  // Masonry breakpoints
  const breakpointColumns = {
    1536: 5,
    1500: 4,
    1280: 4,
    1024: 3,
    768: 2,
    640: 1,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Masonry Grid */}
      <main className="">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore AI Art</h2>

        {prompts.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No prompts yet.</p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex  w-auto"
            columnClassName="bg-clip-padding"
          >
            {prompts.map((prompt) => (      
              <div key={prompt._id}>
                <PromptCard prompt={prompt} session={session} />
              </div>
            ))}
          </Masonry>
        )}
      </main>
    </div>
  );
}