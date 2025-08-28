'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const schema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  category: z.enum(['image', 'video_noaudio', 'video_audio', 'audio', 'webapp', 'mobileapp', 'webgame', 'ui_design', 'text']),
  tags: z.array(z.string()),
  price: z.number().min(0).optional(),
  file: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

export default function NewPrompt() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    data.tags.forEach(tag => formData.append('tags', tag));
    if (data.price) formData.append('price', data.price.toString());
    formData.append('file', data.file);

    const res = await fetch('/api/prompts', { method: 'POST', body: formData });
    if (res.ok) router.push('/studio');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <input {...register('title')} placeholder="Title" />
      {errors.title && <p>{errors.title.message}</p>}
      {/* Add other fields: textarea for desc, select for category, input type="file", etc. */}
      <button type="submit">Create</button>
    </form>
  );
}