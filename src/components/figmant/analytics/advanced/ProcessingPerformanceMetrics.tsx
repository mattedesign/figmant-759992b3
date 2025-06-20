
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Activity } from 'lucide-react';

interface ProcessingPerformanceMetricsProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const ProcessingPerformanceMetrics: React.FC<ProcessingPerformanceMetricsProps> = ({
  realData,
  onExport,
  className
}) => {
  const performanceData = [
    { time: '00:00', processingTime: 2.8, throughput: 95 },
    { time: '04:00', processingTime: 2.5, throughput: 98 },
    { time: '08:00', processingTime: 3.2, throughput: 89 },
    { time: '12:00', processingTime: 2.9, throughput: 92 },
    { time: '16:00', processingTime: 2.6, throughput: 96 },
    { time: '20:00', processingTime: 2.7, throughput: 94 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Processing Performance
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              Avg: 2.8s
            </Badge>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="processingTime" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Processing Time (s)"
            />
            <Line 
              type="monotone" 
              dataKey="throughput" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Success Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
