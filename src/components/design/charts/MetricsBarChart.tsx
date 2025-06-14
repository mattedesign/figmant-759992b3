
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTooltip } from './ChartTooltips';

interface BarChartData {
  name: string;
  value: number;
  category: string;
}

interface MetricsBarChartProps {
  data: BarChartData[];
}

export const MetricsBarChart: React.FC<MetricsBarChartProps> = ({ data }) => {
  const getBarColor = (value: number) => {
    if (value >= 8) return '#10b981'; // green-500
    if (value >= 6) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 10]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              strokeWidth={1}
              stroke="#6366f1"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
