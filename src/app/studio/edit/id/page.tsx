import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOption } from '@/lib/auth'; // Adjust path as needed
import EditForm from '@/components/EditForm';

async function getPrompt(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prompts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    const error = await res.json();
    console.error('Failed to fetch prompt:', error);
    return null;
  }
  return res.json();
}

export default async function EditPrompt({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOption);
  if (!session || !session.user?.id) {
    redirect('/login'); // Redirect to login if not authenticated
  }

  const prompt = await getPrompt(params.id);
  if (!prompt) redirect('/studio'); // Redirect if prompt not found

  return <EditForm initialData={prompt} />;
}