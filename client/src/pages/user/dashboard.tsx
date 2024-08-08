// src/pages/Dashboard.tsx
import Graph from '@components/ui/graph';
import { PageComponent } from '@pages/route-map';

// Sample sales data
const salesData = [
  { date: '2023-01-01', amount: 300 },
  { date: '2023-02-01', amount: 200 },
  { date: '2023-03-01', amount: 150 },
  { date: '2023-04-01', amount: 300 },
  { date: '2023-05-01', amount: 250 },
  { date: '2023-06-01', amount: 400 },
];

const Dashboard: PageComponent = () => {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <Graph salesData={salesData} />
    </div>
  );
};

export default Dashboard;
