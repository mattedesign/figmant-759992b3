
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Brain } from 'lucide-react';

interface ClaudeAnalysisVolumeChartProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const ClaudeAnalysisVolumeChart: React.FC<ClaudeAnalysisVolumeChartProps> = ({
  realData,
  onExport,
  className
}) => {
  const volumeData = [
    { date: '2024-01-01', analyses: 15, chatSessions: 23 },
    { date: '2024-01-02', analyses: 18, chatSessions: 28 },
    { date: '2024-01-03', analyses: 22, chatSessions: 31 },
    { date: '2024-01-04', analyses: 19, chatSessions: 26 },
    { date: '2024-01-05', analyses: 25, chatSessions: 35 },
    { date: '2024-01-06', analyses: 21, chatSessions: 29 },
    { date: '2024-01-07', analyses: 27, chatSessions: 38 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Claude Analysis Volume
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              27 Today
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
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Line 
              type="monotone" 
              dataKey="analyses" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Design Analyses"
            />
            <Line 
              type="monotone" 
              dataKey="chatSessions" 
              stroke="#a855f7" 
              strokeWidth={2}
              name="Chat Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
