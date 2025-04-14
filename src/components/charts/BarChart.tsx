
import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface BarChartProps {
  data: DataPoint[];
  dataKeys: string[];
  colors?: string[];
  xAxisDataKey?: string;
  height?: number;
  stacked?: boolean;
  layout?: "vertical" | "horizontal";
}

const defaultColors = [
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
];

export function BarChart({
  data,
  dataKeys,
  colors = defaultColors,
  xAxisDataKey = "name",
  height = 300,
  stacked = false,
  layout = "horizontal",
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey={xAxisDataKey} 
          tick={{ fontSize: 12 }}
          type={layout === "horizontal" ? "category" : "number"}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          type={layout === "horizontal" ? "number" : "category"}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            stackId={stacked ? "stack" : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
