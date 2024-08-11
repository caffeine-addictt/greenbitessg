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
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { cn } from '@utils/tailwind';

// Define types for sales data and sustainability data
interface SalesData {
  date: string;
  amount: number;
}

interface SustainabilityData {
  label: string; // Ensure the 'label' property is included
  value: number;
}

// Define the Dashboard type using z.infer and dashboardUpdateSchema
type Dashboard = z.infer<typeof dashboardUpdateSchema>;

interface DashboardResponse {
  data: DashboardResponse | PromiseLike<DashboardResponse>;
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
  const { data, isError, isLoading }: UseQueryResult<DashboardResponse> =
    useQuery<DashboardResponse>({
      queryKey: ['dashboard'],
      queryFn: async (): Promise<DashboardResponse> => {
        try {
          const response = await httpClient.get<DashboardResponse>({
            uri: '/dashboard',
            withCredentials: 'access', // Pass withCredentials as 'access'
          });
          return response.data; // Ensure you're returning the data property
        } catch (err) {
          console.error('Fetch error:', err);
          throw err;
        }
      },
      onError: (err: unknown) => {
        if (isAxiosError(err) && err.response) {
          setError('Error fetching dashboard data! Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
        console.error('Query error:', err);
      },
    } as UseQueryOptions<DashboardResponse, Error>); // Ensure the options type matches

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
      const dashboardItem = data.dashboard[0];
      setValue('title', dashboardItem.title);
      setValue('description', dashboardItem.description);
    }
  }, [data, isEditing, setValue]);

  const handleSave = async (formData: Dashboard) => {
    try {
      await httpClient.post({
        uri: '/dashboard/update',
        payload: formData,
        withCredentials: 'access', // Pass withCredentials as 'access'
      });
      setSuccessMessage('Dashboard details updated successfully');
      setError(null);
      setIsEditing(false);
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError(
          `Error: ${error.response.data.errors[0]?.message || 'An error occurred'}`,
        );
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
        <h1 className="text-center text-4xl font-bold">Dashboard</h1>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form Container */}
          <div className="flex-1 rounded-lg bg-white p-8 shadow-lg lg:w-2/5">
            <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
              <div>
                <label className="text-xl font-bold">Title</label>
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
                <label className="text-xl font-bold">Description</label>
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
        <div className="flex justify-center">
          <div className="flex h-96 w-full max-w-4xl items-center justify-center rounded-lg bg-gray-100 p-6 shadow-lg">
            <SustainabilityPieChart data={data?.sustainabilityData || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
