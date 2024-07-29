import { PageComponent } from '@pages/route-map';
import { useNavigate } from 'react-router-dom';

const Dashboard: PageComponent = () => {
  const navigate = useNavigate();

  // Function to navigate to different pages
  const navigateToPage = (path: string) => {
    navigate(path);
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Overview</h2>
          <p className="text-gray-700">Some overview information here...</p>
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
