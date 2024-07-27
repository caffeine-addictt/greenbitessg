// src/pages/user/createevents.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define your form schema using zod
const eventSchema: ZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  file: z.instanceof(File).optional(),
});

// Define TypeScript type for form data
type EventFormData = z.infer<typeof eventSchema>;

const EventCreationPage: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: 'onBlur',
  });

  // Handle form submission
  const onSubmit = (data: EventFormData) => {
    console.log('Form Data:', data);

    // Handle file upload here if needed
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('file', file);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded bg-white p-4 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Create Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register('date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Time
          </label>
          <input
            id="time"
            type="time"
            {...register('time')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Upload File
          </label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventCreationPage;
