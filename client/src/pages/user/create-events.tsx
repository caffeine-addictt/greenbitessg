import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';

import { z } from 'zod';
import httpClient from '@utils/http';
import { eventSchema } from '@lib/api-types/schemas/event';
import { PageComponent } from '@pages/route-map';

type Event = z.infer<typeof eventSchema>;

const EventCreationPage: PageComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const eventForm = useForm<Event>({
    mode: 'onBlur',
    defaultValues: {
      date: new Date(),
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
      const payload = {
        ...data,
        date: new Date(
          `${new Date(data.date).toISOString().split('T')[0]}T${data.time}`,
        ),
      };

      console.log('Sending request with data:', payload);
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
              rules={{
                required: 'Title is required',
              }}
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
              rules={{
                required: 'Date is required',
              }}
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
              rules={{
                required: 'Time is required',
              }}
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
              rules={{
                required: 'Location is required',
              }}
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
              rules={{
                required: 'Description is required',
              }}
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
