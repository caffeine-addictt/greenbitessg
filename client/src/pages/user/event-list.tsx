// src/pages/EventForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@lib/api-types/schemas/event';
import { PageComponent } from '@pages/route-map';

interface EventFormInputs {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}

const EventForm: PageComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormInputs>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = (data: EventFormInputs) => {
    console.log(data);
    // Handle form submission, e.g., send data to the server
  };

  return (
    <div className="mx-auto max-w-2xl rounded bg-white p-4 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Event Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" {...register('title')} />
          {errors.title && (
            <p className="mt-2 text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" {...register('date')} />
          {errors.date && <p>{errors.date.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="time">Time</label>
          <input id="time" type="time" {...register('time')} />
          {errors.time && <p>{errors.time.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="location">Location</label>
          <input id="location" type="text" {...register('location')} />
          {errors.location && <p>{errors.location.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description">Description</label>
          <textarea id="description" {...register('description')} />
          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EventForm;
