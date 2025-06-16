
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

interface ChartDataPoint {
  date: string;
  analyses: number;
  successRate: number;
  avgConfidence: number;
  processingTime: number;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
  metric?: string;
  isLoading: boolean;
  title?: string;
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  metric,
  isLoading,
  title,
  className
}) => {
  const getMetricConfig = (metricKey: string) => {
    switch (metricKey) {
      case 'processingTime':
        return {
          title: 'Processing Time Trends',
          color: '#3b82f6',
          dataKey: 'processingTime',
          unit: 's',
          formatter: (value: number) => `${value.toFixed(1)}s`
        };
      case 'avgConfidence':
        return {
          title: 'Average Confidence Score',
          color: '#10b981',
          dataKey: 'avgConfidence',
          unit: '%',
          formatter: (value: number) => `${value.toFixed(1)}%`
        };
      case 'successRate':
        return {
          title: 'Success Rate',
          color: '#f59e0b',
          dataKey: 'successRate',
          unit: '%',
          formatter: (value: number) => `${value.toFixed(1)}%`
        };
      case 'analyses':
        return {
          title: 'Analysis Volume',
          color: '#8b5cf6',
          dataKey: 'analyses',
          unit: '',
          formatter: (value: number) => value.toString()
        };
      default:
        return {
          title: 'Multi-Metric Overview',
          color: '#6366f1',
          dataKey: 'analyses',
          unit: '',
          formatter: (value: number) => value.toString()
        };
    }
  };

  const config = metric ? getMetricConfig(metric) : getMetricConfig('default');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${config.formatter(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title || config.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // If no specific metric, show multi-metric overview
  if (!metric) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="analyses" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Analyses"
              />
              <Line 
                type="monotone" 
                dataKey="successRate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Success Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  // Single metric chart
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${config.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.color}
            strokeWidth={2}
            fill={`url(#gradient-${config.dataKey})`}
            name={config.title}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
