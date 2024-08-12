import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Sale {
  date: string;
  amount: number;
}

interface GraphProps {
  salesData: Sale[];
}

const Graph: React.FC<GraphProps> = ({ salesData }) => {
  const chartData = {
    labels: salesData.map((sale) => sale.date),
    datasets: [
      {
        label: 'Sales Amount',
        data: salesData.map((sale) => sale.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default Graph;
