// app/prompt/[id]/metadata.ts
import { Metadata } from "next";

async function getPrompt(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/prompts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const prompt = await getPrompt(params.id);
  if (!prompt) return { title: "Prompt Not Found" };

  return {
    title: `${prompt.title} - Prompt Library`,
    description: prompt.isPurchased ? prompt.description : "Unlock this premium AI prompt",
    openGraph: {
      title: prompt.title,
      description: prompt.isPurchased ? prompt.description : "Premium AI Prompt - Buy to Unlock",
      images: prompt.previewUrl,
    },
  };
}