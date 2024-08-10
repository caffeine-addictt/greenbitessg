import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define the type for the props
interface PieChartProps {
  data: {
    label: string;
    value: number;
  }[];
}

// Define colors for the pie chart slices
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A28FFF',
  '#FF6384',
];

const SustainabilityPieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <div className="h-96 w-full rounded-lg bg-white p-8 shadow-lg">
      <h3 className="mb-4 text-center text-xl font-semibold">
        Food Sustainability
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={(entry) => entry.label}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 10 }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SustainabilityPieChart;
