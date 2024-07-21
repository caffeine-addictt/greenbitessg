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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Invite Client</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client's Name</label>
          <input
            id="clientName"
            type="text"
            {...register('clientName')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="inviteMessage" className="block text-sm font-medium text-gray-700">Invite Message</label>
          <textarea
            id="inviteMessage"
            {...register('inviteMessage')}
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.inviteMessage && <p className="text-red-500 text-sm">{errors.inviteMessage.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Invite Client
        </button>
      </form>
    </div>
  );
};

export default InviteClient;
