import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FeedbackFormValues,
  feedbackSchema,
} from '@lib/api-types/schemas/feedback'; // Import the schema from a separate file

const FeedbackForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema), // Make sure to import the schema here
  });

  const onSubmit = (data: FeedbackFormValues) => {
    console.log('Form submitted with data:', data);
    // Handle form submission logic here, e.g., send data to an API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input id="name" type="text" {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label
          htmlFor="suggestion"
          className="block text-sm font-medium text-gray-700"
        >
          Suggestion (optional)
        </label>
        <input id="suggestion" type="text" {...register('suggestion')} />
      </div>

      <div>
        <label
          htmlFor="feedbackMessage"
          className="block text-sm font-medium text-gray-700"
        >
          Feedback Message
        </label>
        <textarea
          id="feedbackMessage"
          {...register('feedbackMessage')}
          rows={4}
        />
        {errors.feedbackMessage && <p>{errors.feedbackMessage.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FeedbackForm;
