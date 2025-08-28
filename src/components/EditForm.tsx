'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title must be 120 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  category: z.enum(['image', 'video_noaudio', 'video_audio', 'audio', 'webapp', 'mobileapp', 'webgame', 'ui_design', 'text'] as const)
    .refine((val) => val !== undefined, { message: 'Invalid category' }),
  tags: z.array(z.string()).optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  file: z.instanceof(File).optional(), // Optional for updating the preview
  modifiedAfterGeneration: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditFormProps {
  initialData: {
    _id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    price: number;
    previewUrl: string;
    modifiedAfterGeneration: boolean;
  };
}

export default function EditForm({ initialData }: EditFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      category: initialData.category as FormData['category'],
      tags: initialData.tags,
      price: initialData.price,
      modifiedAfterGeneration: initialData.modifiedAfterGeneration,
    },
  });

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue('file', file);
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    (data.tags || []).forEach(tag => formData.append('tags', tag));
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.file) formData.append('file', data.file);
    if (data.modifiedAfterGeneration !== undefined) {
      formData.append('modifiedAfterGeneration', data.modifiedAfterGeneration.toString());
    }

    const res = await fetch(`/api/prompts/${initialData._id}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      router.push('/studio'); // Redirect to studio on success
    } else {
      const error = await res.json();
      console.error('Error updating prompt:', error);
      alert('Failed to update prompt: ' + (error.error || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Prompt</h2>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          {...register('title')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter prompt title"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter prompt description"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          {...register('category')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {['image', 'video_noaudio', 'video_audio', 'audio', 'webapp', 'mobileapp', 'webgame', 'ui_design', 'text'].map((cat) => (
            <option key={cat} value={cat} selected={cat === initialData.category}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input
          id="tags"
          {...register('tags')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter tags (e.g., ai, design)"
          onChange={(e) => setValue('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
          defaultValue={initialData.tags.join(',')}
        />
        {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
      </div>

      {/* Price */}
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
        <input
          id="price"
          type="number"
          {...register('price', { valueAsNumber: true })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter price (optional)"
          step="0.01"
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
      </div>

      {/* File Upload (optional) */}
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload New Preview File (optional)</label>
        <input
          id="file"
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {initialData.previewUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Current Preview:</p>
            <img src={initialData.previewUrl} alt="Current Preview" className="mt-1 w-32 h-32 object-cover rounded-md" />
          </div>
        )}
      </div>

      {/* Modified After Generation */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Modified After Generation</label>
        <input
          type="checkbox"
          {...register('modifiedAfterGeneration')}
          defaultChecked={initialData.modifiedAfterGeneration}
          className="mt-1 ml-2"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Prompt
      </button>
    </form>
  );
}