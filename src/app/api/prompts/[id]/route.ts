import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { v4 as uuidv4 } from 'uuid';
import { authOption } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Prompt from '@/models/promptModel/prompt';
import { getUploadUrl, deleteFromS3 } from '@/lib/s3';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const prompt = await Prompt.findById(params.id).populate('createdBy', 'name avatarUrl');
    if (!prompt) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
  const price = priceStr ? parseFloat(priceStr) : undefined;
  const file = formData.get('file') as File | null;
  const modifiedAfterGeneration = formData.get('modifiedAfterGeneration') === 'true';

  try {
    const prompt = await Prompt.findById(params.id);
    if (!prompt) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    if (prompt.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to edit this prompt' }, { status: 403 });
    }

    // Update fields
    if (title) prompt.title = title.trim().slice(0, 120);
    if (description) prompt.description = description.slice(0, 2000);
    if (category) {
      const validCategories = ['image', 'video_noaudio', 'video_audio', 'audio', 'webapp', 'mobileapp', 'webgame', 'ui_design', 'text'];
      if (!validCategories.includes(category)) return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      prompt.category = category;
    }
    if (tags) prompt.tags = tags;
    if (price !== undefined) {
      if (price < 0) return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
      prompt.price = price;
    }
    prompt.modifiedAfterGeneration = modifiedAfterGeneration;

    // Handle new file
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const newS3Key = `${uuidv4()}-${file.name}`;
      const newPreviewUrl = await getUploadUrl( newS3Key, file.type);
      // Delete old file from S3
      await deleteFromS3(prompt.s3Key);
      prompt.s3Key = newS3Key;
      prompt.previewUrl = newPreviewUrl;
      prompt.contentType = file.type;
    }

    await prompt.save();
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOption);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const prompt = await Prompt.findById(params.id);
    if (!prompt) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    if (prompt.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this prompt' }, { status: 403 });
    }

    // Delete from S3
    await deleteFromS3(prompt.s3Key);
    // Delete from DB
    await Prompt.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Prompt deleted' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}