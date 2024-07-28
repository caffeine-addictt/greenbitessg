import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FeedbackFormValues,
  feedbackSchema,
} from '@lib/api-types/schemas/feedback'; // Import the schema from a separate file
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'; // Custom form components
import { PageComponent } from '@pages/route-map';

const FeedbackForm: PageComponent = () => {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema), // Make sure to import the schema here
  });

  const onSubmit = (data: FeedbackFormValues) => {
    console.log('Form submitted with data:', data);
    // Handle form submission logic here, e.g., send data to an API
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormControl>
            <input type="text" {...form.register('name')} />
          </FormControl>
          <FormMessage>{form.formState.errors.name?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormControl>
            <input type="email" {...form.register('email')} />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="suggestion">Suggestion (optional)</FormLabel>
          <FormControl>
            <input type="text" {...form.register('suggestion')} />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="feedbackMessage">Feedback Message</FormLabel>
          <FormControl>
            <textarea rows={4} {...form.register('feedbackMessage')} />
          </FormControl>
          <FormMessage>
            {form.formState.errors.feedbackMessage?.message}
          </FormMessage>
        </FormItem>

        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
