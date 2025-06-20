
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

interface ROIProjectionsChartProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const ROIProjectionsChart: React.FC<ROIProjectionsChartProps> = ({
  realData,
  onExport,
  className
}) => {
  const projectionData = [
    { month: 'Jan', conservative: 15000, optimistic: 25000, realized: 18000 },
    { month: 'Feb', conservative: 18000, optimistic: 30000, realized: 22000 },
    { month: 'Mar', conservative: 22000, optimistic: 35000, realized: 28000 },
    { month: 'Apr', conservative: 25000, optimistic: 40000, realized: 32000 },
    { month: 'May', conservative: 28000, optimistic: 45000, realized: 35000 },
    { month: 'Jun', conservative: 32000, optimistic: 50000, realized: 38000 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            ROI Projections
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              $38K Current
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
          <AreaChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
            <Area 
              type="monotone" 
              dataKey="conservative" 
              stackId="1"
              stroke="#dc2626" 
              fill="#fecaca"
              name="Conservative"
            />
            <Area 
              type="monotone" 
              dataKey="optimistic" 
              stackId="2"
              stroke="#059669" 
              fill="#a7f3d0"
              name="Optimistic"
            />
            <Area 
              type="monotone" 
              dataKey="realized" 
              stackId="3"
              stroke="#2563eb" 
              fill="#93c5fd"
              name="Realized"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
