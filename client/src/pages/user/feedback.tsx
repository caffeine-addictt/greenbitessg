import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import httpClient from '@utils/http';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@components/ui/form';
import { z } from 'zod';
import { feedbackRequestObject } from '@lib/api-types/schemas/feedback'; // Adjust the import path as needed
import { PageComponent } from '@pages/route-map';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the Feedback type using z.infer and feedbackRequestObject
type Feedback = z.infer<typeof feedbackRequestObject>;

const FeedbackForm: PageComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const feedbackForm = useForm<Feedback>({
    mode: 'onBlur',
    resolver: zodResolver(feedbackRequestObject),
    defaultValues: {
      name: '',
      email: '',
      suggestion: '',
      feedbackMessage: '',
    },
  });

  const { isSubmitting } = useFormState({
    control: feedbackForm.control,
  });

  const handleSave = async (data: Feedback) => {
    try {
      console.log('Sending request with data:', data); // Log the data being sent
      const response = await httpClient.post<Feedback, Feedback>({
        uri: '/feedback',
        payload: data,
        withCredentials: 'access',
      });

      console.log('Response received:', response);
      setSuccessMessage('Feedback submitted successfully');
      setError(null);
      feedbackForm.reset();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback');
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Submit Feedback</h1>
      <div className="mx-auto mt-8 w-full max-w-xl rounded-lg bg-white p-6 shadow-md">
        <Form {...feedbackForm}>
          <form
            onSubmit={feedbackForm.handleSubmit(handleSave)}
            className="space-y-6"
          >
            {error && <p className="text-center text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-center text-green-500">{successMessage}</p>
            )}

            <FormField
              control={feedbackForm.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      className={fieldState.error ? 'border-red-700' : ''}
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  ) : (
                    <FormDescription>Enter your name.</FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={feedbackForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className={fieldState.error ? 'border-red-700' : ''}
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  ) : (
                    <FormDescription>Enter your email address.</FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={feedbackForm.control}
              name="suggestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Suggestion" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={feedbackForm.control}
              name="feedbackMessage"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Feedback Message</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Your Feedback"
                      className={` ${fieldState.error ? 'border-red-700' : ''} w-full rounded border p-2`}
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  ) : (
                    <FormDescription>
                      Provide your feedback here.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="reset"
                variant="ghost"
                disabled={isSubmitting || !feedbackForm.formState.isDirty}
                onClick={() => feedbackForm.reset()}
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FeedbackForm;
