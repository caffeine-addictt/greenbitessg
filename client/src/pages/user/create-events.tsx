import React, { useState } from 'react';
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
import { cn } from '@utils/tailwind';
import { CreateEventSuccAPI } from '@lib/api-types/event';
import { AxiosError } from 'axios';

// Define TypeScript type for form data
type EventFormData = {
  title: string;
  date: string; // The date should be in YYYY-MM-DD format
  time: string;
  location: string;
  description?: string;
};

const EventCreationPage: React.FC<{ className?: string }> = ({
  className,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const eventForm = useForm<EventFormData>({
    mode: 'onBlur',
  });

  const { isSubmitting } = useFormState({
    control: eventForm.control,
  });

  const handleSave = async (data: EventFormData) => {
    console.log('Form data:', data); // Log form data for debugging
    try {
      console.log('Sending request...');
      const response = await httpClient.post<CreateEventSuccAPI, EventFormData>(
        {
          uri: '/event',
          payload: data,
          withCredentials: 'access',
        },
      );
      console.log('Response received:', response);
      setSuccessMessage('Event created successfully');
      setError(null);
      eventForm.reset();
    } catch (err) {
      console.error('Request failed:', err);
      if (err instanceof AxiosError) {
        if (err.response) {
          setError(
            `Server error: ${err.response?.data?.errors?.[0]?.message || 'An unexpected error occurred'}`,
          );
        } else if (err.request) {
          setError(
            'Network error: Please check your connection and try again.',
          );
        } else {
          setError(
            `Error creating event! ${err.message || 'An unexpected error occurred'}`,
          );
        }
      } else {
        setError(
          `Error creating event! ${String(err) || 'An unexpected error occurred'}`,
        );
      }
      setSuccessMessage(null);
    }
  };

  return (
    <div {...props} className={cn(className, 'container mx-auto mt-16')}>
      <h1 className="text-center text-2xl font-bold">Create Event</h1>
      <Form {...eventForm}>
        <form
          onSubmit={eventForm.handleSubmit(handleSave)}
          className="mt-8 w-[26.5rem] space-y-4"
        >
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <FormField
            control={eventForm.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Event Title"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field} // Ensure no duplicate `value` props
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                ) : (
                  <FormDescription>Enter the event title.</FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={eventForm.control}
            name="date"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field} // Ensure no duplicate `value` props
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                ) : (
                  <FormDescription>Select the event date.</FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={eventForm.control}
            name="time"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field} // Ensure no duplicate `value` props
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                ) : (
                  <FormDescription>Enter the event time.</FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={eventForm.control}
            name="location"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Event Location"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field} // Ensure no duplicate `value` props
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                ) : (
                  <FormDescription>Enter the event location.</FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={eventForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Event Description"
                    className={` ${fieldState.error ? 'border-red-700' : ''}`}
                    {...field} // Ensure no duplicate `value` props
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                ) : (
                  <FormDescription>
                    Provide a description for the event.
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="reset"
              variant="ghost"
              disabled={isSubmitting || !eventForm.formState.isDirty}
              onClick={() => eventForm.reset()}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventCreationPage;
