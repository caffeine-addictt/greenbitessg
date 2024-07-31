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
import { eventSchema } from '@lib/api-types/schemas/event'; // Adjust the import path as needed
import { PageComponent } from '@pages/route-map';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

const EventCreationPage: PageComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const eventForm = useForm<Event>({
    mode: 'onBlur',
    defaultValues: {
      date: new Date(), // Default value set as today
      time: '',
      location: '',
      description: '',
      title: '',
    },
  });

  const { isSubmitting } = useFormState({
    control: eventForm.control,
  });

  const handleSave = async (data: Event) => {
    try {
      // Convert date to ISO string and combine with time
      const formattedDateTime = `${new Date(data.date).toISOString().split('T')[0]}T${data.time}`;

      // Prepare the payload with Date object
      const payload = {
        ...data,
        date: new Date(formattedDateTime), // Convert to Date object for payload
      };

      console.log('Sending request with data:', payload); // Log the data being sent
      const response = await httpClient.post<Event, Event>({
        uri: '/event',
        payload: payload,
        withCredentials: 'access',
      });

      console.log('Response received:', response);
      setSuccessMessage('Event created successfully');
      setError(null);
      eventForm.reset();
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Create Event</h1>
      <div className="mx-auto mt-8 w-full max-w-xl rounded-lg bg-white p-6 shadow-md">
        <Form {...eventForm}>
          <form
            onSubmit={eventForm.handleSubmit(handleSave)}
            className="space-y-6"
          >
            {error && <p className="text-center text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-center text-green-500">{successMessage}</p>
            )}

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
                      {...field}
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
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
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
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
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
                      {...field}
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
                      className={` ${fieldState.error ? 'border-red-700' : ''} w-full rounded border p-2`}
                      {...field}
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
    </div>
  );
};

export default EventCreationPage;
