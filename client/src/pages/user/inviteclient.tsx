import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

// Define the schema for form validation
const schema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  inviteMessage: z.string().min(1, 'Invite message is required'),
});

type FormData = z.infer<typeof schema>;

const InviteClient: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    // Add your logic here to handle the form submission, e.g., sending data to the server.

    // Redirect to a success page or another route after successful submission
    navigate('/success'); // Replace '/success' with your actual route
  };

  return (
    <div>
      <h1>Invite Client</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="clientName"
            className="block text-sm font-medium text-gray-700"
          >
            Client's Name
          </label>
          <input id="clientName" type="text" {...register('clientName')} />
          {errors.clientName && <p>{errors.clientName.message}</p>}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label
            htmlFor="inviteMessage"
            className="block text-sm font-medium text-gray-700"
          >
            Invite Message
          </label>
          <textarea
            id="inviteMessage"
            {...register('inviteMessage')}
            rows={4}
          />
          {errors.inviteMessage && <p>{errors.inviteMessage.message}</p>}
        </div>

        <button type="submit">Invite Client</button>
      </form>
    </div>
  );
};

export default InviteClient;
