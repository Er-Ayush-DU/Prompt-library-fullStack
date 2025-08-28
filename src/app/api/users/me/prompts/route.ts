import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOption } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Prompt from '@/models/promptModel/prompt';

export async function GET() {
  const session = await getServerSession(authOption);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const prompts = await Prompt.find({ createdBy: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}