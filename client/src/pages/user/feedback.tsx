import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormValues, feedbackSchema } from '@lib/api-types/schemas/feedback'; // Import the schema from a separate file

const FeedbackForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema), // Make sure to import the schema here
  });

  const onSubmit = (data: FeedbackFormValues) => {
    console.log('Form submitted with data:', data);
    // Handle form submission logic here, e.g., send data to an API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700">
          Suggestion (optional)
        </label>
        <input
          id="suggestion"
          type="text"
          {...register('suggestion')}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="feedbackMessage" className="block text-sm font-medium text-gray-700">
          Feedback Message
        </label>
        <textarea
          id="feedbackMessage"
          {...register('feedbackMessage')}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.feedbackMessage ? 'border-red-500' : 'border-gray-300'}`}
          rows={4}
        />
        {errors.feedbackMessage && <p className="text-red-500 text-sm">{errors.feedbackMessage.message}</p>}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default FeedbackForm;
