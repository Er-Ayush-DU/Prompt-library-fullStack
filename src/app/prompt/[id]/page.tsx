import { Metadata } from 'next';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prompt = await getPrompt(params.id); // Reuse fetch function
  return {
    title: prompt?.title || 'Prompt Detail',
    description: prompt?.description.slice(0, 160),
    openGraph: {
      title: prompt?.title,
      description: prompt?.description,
      images: prompt?.previewUrl,
    },
  };
}

async function getPrompt(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prompts/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PromptDetail({ params }: Props) {
  const prompt = await getPrompt(params.id);
  if (!prompt) return <div>Prompt not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
      <img src={prompt.previewUrl} alt={prompt.title} className="w-full h-64 object-cover mb-4" />
      <p>{prompt.description}</p>
      <p>Category: {prompt.category}</p>
      <p>Price: ${prompt.price}</p>
      <p>Tags: {prompt.tags.join(', ')}</p>
      <p>Likes: {prompt.likesCount} | Comments: {prompt.commentsCount}</p>
      {/* Add likes/comments UI in Day 3 */}
    </div>
  );
}