import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '@utils/http';
import { getAuthCookie } from '@utils/jwt'; // Assuming you have an auth utility to get the token

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{
    id: number;
    title: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getAuthCookie('access'); // Pass 'access' tokenType here
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await httpClient.get<{
          status: number;
          data: {
            id: number;
            title: string;
            description?: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
          };
        }>({
          uri: '/dashboard', // Ensure this is the correct endpoint
          options: {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request
            },
          },
        });

        const { data } = response;

        if (data) {
          setDashboardData(data);
        } else {
          setError('Invalid data received from the server');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateToPage = (path: string) => {
    navigate(path);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Overview</h2>
          <p className="text-gray-700">
            {dashboardData?.description || 'No overview information available.'}
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Recent Activities</h2>
          <ul>
            <li>Activity 1</li>
            <li>Activity 2</li>
            <li>Activity 3</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Statistics</h2>
          <p className="text-gray-700">Some statistics here...</p>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Settings</h2>
          <button onClick={() => navigateToPage('/settings')}>
            Go to Settings
          </button>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">User Management</h2>
          <button onClick={() => navigateToPage('/user-management')}>
            Manage Users
          </button>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Reports</h2>
          <button onClick={() => navigateToPage('/reports')}>
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
