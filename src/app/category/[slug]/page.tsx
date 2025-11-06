// app/category/[slug]/page.tsx
import PromptCard from "@/components/PromptCard";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import Image from "next/image";

const categoryImages: Record<string, string> = {
  image: "/categories/image.jpg",
  video: "/categories/video.jpg",
  audio: "/categories/audio.avif",
  clips: "/categories/clips.avif",
  games: "/categories/games.avif",
  webapps: "/categories/webapps.jpg",
  ui_design: "/categories/ui_design.jpg",
  other: "/categories/other.jpg",
};

export async function generateStaticParams() {
  return [
    { slug: "image" },
    { slug: "video" },
    { slug: "audio" },
    { slug: "clips" },
    { slug: "games" },
    { slug: "webapps" },
    { slug: "ui_design" },
    { slug: "other" },
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>; // <-- PROMISE TYPE
}) {
  // 1. AWAIT PARAMS
  const { slug } = await params;

  const session = await getServerSession(authOption);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // 2. FIX URL — process.env.NEXTAUTH_URL → fallback
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/prompts?category=${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Error loading prompts</div>;
  }

  const { prompts } = await res.json();
  const heroImage = categoryImages[slug] || "/categories/default.jpg";

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={`${categoryName} Hero`}
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center drop-shadow-2xl">
            {categoryName} Prompts
          </h1>
        </div>
      </section>

      {/* PROMPTS GRID */}
      <main className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Explore {categoryName} AI Art
        </h2>

        {prompts.length === 0 ? (
          <p className="text-center text-gray-500 py-20 text-lg">
            No {categoryName.toLowerCase()} prompts yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {prompts.map((prompt: any) => (
              <PromptCard key={prompt._id} prompt={prompt} session={session} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}