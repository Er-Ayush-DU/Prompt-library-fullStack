// app/myprompts/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PurchasedPrompt {
  _id: string;
  title: string;
  description: string;
  price: number;
  previewUrl: string;
  purchasedAt: string;
}

export default function MyPromptsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState<PurchasedPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    fetchPurchasedPrompts();
  }, [session, status, router]);

  const fetchPurchasedPrompts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/my-purchases");
      
      if (!res.ok) throw new Error("Failed to fetch purchases");
      
      const data = await res.json();
      setPrompts(data.purchases || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Purchased Prompts</h1>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Purchased Prompts</h1>
          <span className="text-gray-600">
            {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} purchased
          </span>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              You haven't purchased any prompts yet.
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Prompts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div key={prompt._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {/* Preview Image */}
                <div className="aspect-video w-full">
                  <img
                    src={prompt.previewUrl || "/placeholder-image.jpg"}
                    alt={prompt.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                    {prompt.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {prompt.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-medium">₹{prompt.price}</span>
                    <span className="text-xs text-gray-500">
                      Purchased on {new Date(prompt.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                    Use Prompt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}