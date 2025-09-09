import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Comment from '@/models/commentsModel/comments'; // New Comment model
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const comments = await Comment.find({ promptId: id })
        .sort({ createdAt: -1 })
        .lean();
      res.status(200).json(comments);
    } catch (error) {
      console.error('Fetch comments error:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOption);
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: 'Invalid prompt ID' });
      }

      const comment = {
        promptId: id,
        userId: session.user.id,
        userName: session.user.name || 'Anonymous',
        text,
        createdAt: new Date(),
      };
      const savedComment = await Comment.create(comment);
      res.status(201).json({ message: 'Comment added', comment: savedComment });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}