import React from 'react';

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const SustainabilityPieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <div>
      {data.map((_, index) => (
        <div key={index}>{/* Render chart entry */}</div>
      ))}
    </div>
  );
};

export default SustainabilityPieChart;
