import React from "react";
import { Radar } from "react-chartjs-2";

interface RadarChartProps {
  data: any;
  options: any;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, options }) => {
  return <Radar data={data} options={options} width={500} height={500} />;
};

export default RadarChart;
