  "use client";

  import { useEffect, useState } from "react";
  import PromptCard from "@/components/PromptCard";
  import { useSession } from "next-auth/react";
  import Masonry from "react-masonry-css";
  import Image from "next/image";

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* HERO SECTION */}
        <section className="relative h-screen w-full overflow-hidden">
          <Image
            src="/assets/hero_image.jpg"
            alt="AI Art Hero"
            fill
            priority
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl">
              Discover AI Art
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Explore, buy, and own stunning AI-generated prompts from creators worldwide.
            </p>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* PROMPTS GRID */}
        <main className="container mx-auto py-16">
          {prompts.length === 0 ? (
            <p className="text-center text-gray-500 py-20 text-lg">
              No image prompts yet.
            </p>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex w-auto -ml-4"
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