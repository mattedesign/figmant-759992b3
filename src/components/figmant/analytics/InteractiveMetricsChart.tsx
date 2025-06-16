
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { 
  LineChart as LineChartIcon,
  BarChart3,
  Activity,
  ZoomIn,
  ZoomOut,
  Download
} from 'lucide-react';

interface ChartDataPoint {
  date: string;
  analyses: number;
  successRate: number;
  avgConfidence: number;
  processingTime: number;
}

interface InteractiveMetricsChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
  title?: string;
  className?: string;
}

export const InteractiveMetricsChart: React.FC<InteractiveMetricsChartProps> = ({
  data,
  isLoading,
  title = 'Interactive Metrics Overview',
  className
}) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['analyses', 'successRate']);
  const [zoomLevel, setZoomLevel] = useState<'7d' | '30d' | 'all'>('30d');

  const metrics = [
    { key: 'analyses', label: 'Analyses', color: '#3b82f6', unit: '' },
    { key: 'successRate', label: 'Success Rate', color: '#10b981', unit: '%' },
    { key: 'avgConfidence', label: 'Confidence', color: '#f59e0b', unit: '%' },
    { key: 'processingTime', label: 'Processing Time', color: '#8b5cf6', unit: 's' }
  ];

  const getFilteredData = () => {
    const now = new Date();
    if (zoomLevel === '7d') {
      return data.slice(-7);
    } else if (zoomLevel === '30d') {
      return data.slice(-30);
    }
    return data;
  };

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{metric?.label}:</span>
                <span className="font-medium">
                  {entry.value.toFixed(1)}{metric?.unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const filteredData = getFilteredData();
    const chartProps = {
      data: filteredData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const renderLines = () => selectedMetrics.map(metricKey => {
      const metric = metrics.find(m => m.key === metricKey);
      if (!metric) return null;

      if (chartType === 'line') {
        return (
          <Line
            key={metricKey}
            type="monotone"
            dataKey={metricKey}
            stroke={metric.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        );
      } else if (chartType === 'area') {
        return (
          <Area
            key={metricKey}
            type="monotone"
            dataKey={metricKey}
            stroke={metric.color}
            fill={metric.color}
            fillOpacity={0.3}
          />
        );
      } else {
        return (
          <Bar
            key={metricKey}
            dataKey={metricKey}
            fill={metric.color}
          />
        );
      }
    });

    const ChartComponent = chartType === 'bar' ? BarChart : 
                          chartType === 'area' ? AreaChart : LineChart;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent {...chartProps}>
          <defs>
            {selectedMetrics.map(metricKey => {
              const metric = metrics.find(m => m.key === metricKey);
              return (
                <linearGradient key={metricKey} id={`gradient-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric?.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metric?.color} stopOpacity={0}/>
                </linearGradient>
              );
            })}
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
          {renderLines()}
          <Brush 
            dataKey="date" 
            height={30}
            stroke="#3b82f6"
            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          {/* Chart Type */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Chart:</span>
            <div className="flex gap-1">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('area')}
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Range:</span>
            <div className="flex gap-1">
              {(['7d', '30d', 'all'] as const).map(range => (
                <Button
                  key={range}
                  variant={zoomLevel === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setZoomLevel(range)}
                >
                  {range === 'all' ? 'All' : range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Selection */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600">Metrics:</span>
          <div className="flex flex-wrap gap-2">
            {metrics.map(metric => (
              <Badge
                key={metric.key}
                variant={selectedMetrics.includes(metric.key) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleMetric(metric.key)}
                style={{
                  backgroundColor: selectedMetrics.includes(metric.key) ? metric.color : 'transparent',
                  borderColor: metric.color,
                  color: selectedMetrics.includes(metric.key) ? 'white' : metric.color
                }}
              >
                {metric.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedMetrics.length > 0 ? renderChart() : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select at least one metric to display the chart</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
