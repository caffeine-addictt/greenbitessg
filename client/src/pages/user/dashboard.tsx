import { useEffect, useState } from 'react';
import httpClient from '@utils/http';
import { PageComponent } from '@pages/route-map';
import { dashboardUpdateSchema } from '@lib/api-types/schemas/dashboard';
import { z } from 'zod';
import Graph from '@components/ui/graph';
import SustainabilityPieChart from '@components/ui/pieChart';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { cn } from '@utils/tailwind';

// Define types for sales data and sustainability data
interface SalesData {
  date: string;
  amount: number;
}

interface SustainabilityData {
  name: string;
  value: number;
}

// Define the Dashboard type using z.infer and dashboardUpdateSchema
type Dashboard = z.infer<typeof dashboardUpdateSchema>;

interface DashboardResponse {
  data: Record<string, unknown>; // Use Record<string, unknown> as a placeholder for unknown structures
  dashboard: Dashboard[];
  salesData: SalesData[];
  sustainabilityData: SustainabilityData[];
}

const Dashboard: PageComponent = ({ className, ...props }) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch dashboard data from the server
  const { data, isError, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        const response = await httpClient.get<DashboardResponse>({
          uri: '/dashboard',
          withCredentials: 'access',
        });
        return response.data;
      } catch (err) {
        console.error('Fetch error:', err);
        throw err;
      }
    },
    onError: () => {
      setError('Error fetching dashboard data! Please try again later.');
    },
  });

  // Initialize form with empty values
  const DashboardForm = useForm<Dashboard>({
    resolver: zodResolver(dashboardUpdateSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = DashboardForm;

  // Update form values when data is fetched
  useEffect(() => {
    if (data?.dashboard && data.dashboard.length > 0 && !isEditing) {
      const dashboardItem = data.dashboard[0]; // Assuming you want the first item in the array
      setValue('title', dashboardItem.title);
      setValue('description', dashboardItem.description);
    }
  }, [data, isEditing, setValue]);

  const handleSave = async (formData: Dashboard) => {
    try {
      await httpClient.post({
        uri: '/dashboard/update',
        payload: formData,
        withCredentials: 'access',
      });
      setSuccessMessage('Dashboard details updated successfully');
      setError(null);
      setIsEditing(false);
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError(`Error: ${error.response.data.message}`);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setSuccessMessage(null);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error}</p>;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-screen p-8',
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form Container */}
          <div className="flex-1 rounded-lg bg-white p-8 shadow-lg lg:w-2/5">
            <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
              <div>
                <label className="text-xl">Title</label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter title"
                      {...field}
                      className="w-full py-4 text-xl"
                      disabled={!isEditing}
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-xl">Description</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter description"
                      {...field}
                      className="w-full py-4 text-xl"
                      disabled={!isEditing}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>

              {isEditing && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-500 py-4 text-xl text-white hover:bg-blue-600"
                >
                  Save
                </Button>
              )}

              {error && <p className="mt-2 text-xl text-red-500">{error}</p>}
              {successMessage && (
                <p className="mt-2 text-xl text-green-500">{successMessage}</p>
              )}
            </form>
            {!isEditing && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleEditClick}
                  className="text-xl text-blue-500"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Graph Container */}
          <div className="flex-1 rounded-lg bg-gray-100 p-8 shadow-lg lg:w-3/5">
            <Graph salesData={data?.salesData || []} />
          </div>
        </div>

        {/* Pie Chart Container */}
        <div className="flex justify-center rounded-lg bg-gray-100 p-12 shadow-lg">
          <SustainabilityPieChart data={data?.sustainabilityData || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
