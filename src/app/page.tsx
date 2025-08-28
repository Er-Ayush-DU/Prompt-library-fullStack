import { Metadata } from 'next';
import { redirect } from 'next/navigation'; // Not needed here, but for protected
import PromptCard from '@/components/promptCard/page';

export const metadata: Metadata = {
  title: 'PromptLibrary - Home',
  description: 'Browse AI-generated prompts',
  openGraph: {
    title: 'PromptLibrary',
    description: 'Marketplace for AI prompts',
    images: '/og-image.png', // Add your OG image
  },
};

async function getPrompts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prompts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch prompts');
  return res.json();
}

export default async function Home() {
  const prompts = await getPrompts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Home Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prompts.map((prompt: any) => (
          <PromptCard key={prompt._id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}