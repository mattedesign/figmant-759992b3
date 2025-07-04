
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

interface ConfidenceScoreDistributionProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const ConfidenceScoreDistribution: React.FC<ConfidenceScoreDistributionProps> = ({
  realData,
  onExport,
  className
}) => {
  const confidenceData = [
    { range: '90-100%', count: 12, percentage: 28 },
    { range: '80-89%', count: 18, percentage: 42 },
    { range: '70-79%', count: 8, percentage: 19 },
    { range: '60-69%', count: 3, percentage: 7 },
    { range: '50-59%', count: 2, percentage: 4 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Confidence Score Distribution
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              Avg: 84.3%
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
          <BarChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" name="Analyses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
