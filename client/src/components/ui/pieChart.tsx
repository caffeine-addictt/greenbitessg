import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TooltipItem,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SustainabilityPieChartProps {
  data: {
    label: string;
    value: number;
  }[];
}

const SustainabilityPieChart: React.FC<SustainabilityPieChartProps> = ({
  data,
}) => {
  // Prepare data for the chart
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF5733',
          '#C70039',
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex size-full items-center justify-center p-6">
      <div className="size-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SustainabilityPieChart;
