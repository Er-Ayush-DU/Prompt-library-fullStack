import Link from 'next/link';

interface PromptCardProps {
  prompt: {
    _id: string;
    title: string;
    description: string;
    previewUrl: string;
    price: number;
    createdBy: { name: string };
  };
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div className="border p-4 rounded-lg">
      <img src={prompt.previewUrl} alt={prompt.title} className="w-full h-48 object-cover mb-2" />
      <h2 className="text-xl font-semibold">{prompt.title}</h2>
      <p className="text-gray-600">{prompt.description.slice(0, 100)}...</p>
      <p>Price: ${prompt.price}</p>
      <p>By: {prompt.createdBy.name}</p>
      <Link href={`/prompt/${prompt._id}`} className="text-blue-500">View Details</Link>
    </div>
  );
}