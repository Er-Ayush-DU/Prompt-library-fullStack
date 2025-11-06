// app/search/page.tsx
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import Image from "next/image";
import MasonryGrid from "@/components/MasonryGrid";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const session = await getServerSession(authOption);
  const query = searchParams.q || "";
  const encodedQuery = encodeURIComponent(query);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${baseUrl}/api/search?q=${encodedQuery}`, {
    cache: "no-store",
  });
  const { prompts } = await res.json();

  const hasResults = prompts.length > 0;

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src={
            hasResults
              ? "https://images.unsplash.com/photo-1762030085994-79285eee5bc9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000"
              : "https://unsplash.com/photos/a-waterfall-in-the-middle-of-a-lush-green-valley-PkmNfqop-Ro"
          }
          alt={hasResults ? "Search Results" : "No Results"}
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {hasResults ? (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl">
                {prompts.length} Results
              </h1>
              <p className="text-2xl md:text-4xl text-pink-300 font-bold drop-shadow-lg">
                "{query}"
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
                No Results Found
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
                Your search for <span className="text-pink-300 font-bold">"{query}"</span> didn’t return any results.
              </p>
              <p className="text-gray-300">
                Try different keywords or remove filters.
              </p>
            </>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* RESULTS GRID — CLIENT COMPONENT */}
      <main className="container mx-auto px-4 py-16">
        {hasResults ? (
          <MasonryGrid prompts={prompts} session={session} />
        ) : (
          <div className="flex flex-col items-center py-20">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mb-6" />
            <p className="text-gray-500 text-center max-w-md">
              Try searching for popular terms like <strong>AI Art</strong>, <strong>Logo Design</strong>, or <strong>Photography</strong>.
            </p>
          </div>
        )}
      </main>
    </>
  );
}