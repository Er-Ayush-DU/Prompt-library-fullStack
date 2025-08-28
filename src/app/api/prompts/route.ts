import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { v4 as uuidv4 } from 'uuid';
import { authOption } from '@/lib/auth'; // Adjust path if needed
import { dbConnect } from '@/lib/db'; // Assuming this is your db connection
import Prompt from '@/models/promptModel/prompt'; // Adjust path to your Prompt model
import { getUploadUrl } from '@/lib/s3'; // Adjust path to your S3 utility

export async function POST(req: Request) {
  const session = await getServerSession(authOption);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const tags = formData.getAll('tags') as string[];
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : 0;
  const file = formData.get('file') as File | null;

  if (!title || !description || !category || !file) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (price < 0) {
    return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
  }

  const validCategories = [
    'image',
    'video_noaudio',
    'video_audio',
    'audio',
    'webapp',
    'mobileapp',
    'webgame',
    'ui_design',
    'text',
  ];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const s3Key = `${uuidv4()}-${file.name}`;
    const previewUrl = await getUploadUrl(s3Key, file.type);

    const newPrompt = new Prompt({
      title: title.trim().slice(0, 120),
      description: description.slice(0, 2000),
      category,
      contentType: file.type,
      tags,
      price,
      createdBy: session.user.id,
      s3Key,
      previewUrl,
      likesCount: 0,
      commentsCount: 0,
      modifiedAfterGeneration: false, // Default as per schema
    });

    await newPrompt.save();
    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const prompts = await Prompt.find({})
      .sort({ createdAt: -1 }) // Optional: sort by newest first
      .populate('createdBy', 'name avatarUrl'); // Populate basic user info

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}