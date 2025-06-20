
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Target, Download, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ExecutiveMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface ExecutiveSummaryWidgetProps {
  totalROI: number;
  monthlyImpact: number;
  successRate: number;
  completedAnalyses: number;
  className?: string;
}

export const ExecutiveSummaryWidget: React.FC<ExecutiveSummaryWidgetProps> = ({
  totalROI,
  monthlyImpact,
  successRate,
  completedAnalyses,
  className
}) => {
  const executiveMetrics: ExecutiveMetric[] = [
    {
      title: 'Projected Annual ROI',
      value: `${totalROI.toFixed(0)}%`,
      change: '+23%',
      trend: 'up',
      description: 'Return on UX investment'
    },
    {
      title: 'Monthly Revenue Impact',
      value: `$${Math.round(monthlyImpact).toLocaleString()}`,
      change: '+$12K',
      trend: 'up',
      description: 'Estimated monthly increase'
    },
    {
      title: 'Analysis Success Rate',
      value: `${successRate.toFixed(1)}%`,
      change: '+2.1%',
      trend: 'up',
      description: 'Claude AI accuracy'
    },
    {
      title: 'Completed Analyses',
      value: completedAnalyses.toString(),
      change: '+15',
      trend: 'up',
      description: 'This month'
    }
  ];

  // Mock trend data for executive chart
  const trendData = [
    { month: 'Jan', revenue: 85000, roi: 120 },
    { month: 'Feb', revenue: 92000, roi: 135 },
    { month: 'Mar', revenue: 98000, roi: 142 },
    { month: 'Apr', revenue: 105000, roi: 158 },
    { month: 'May', revenue: 112000, roi: 165 },
    { month: 'Jun', revenue: 118000, roi: 178 }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            Executive Summary
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              Business Intelligence
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {executiveMetrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{metric.title}</span>
                {metric.title.includes('ROI') && <TrendingUp className="h-4 w-4 text-green-600" />}
                {metric.title.includes('Revenue') && <DollarSign className="h-4 w-4 text-blue-600" />}
                {metric.title.includes('Success') && <Target className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-gray-500">{metric.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Trend Chart */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Revenue Impact Trend
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : `${value}%`,
                    name === 'revenue' ? 'Revenue Impact' : 'ROI'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Executive Insights */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Key Business Insights</h4>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• UX optimizations are projected to increase conversion rates by 15-25%</li>
            <li>• Current analysis confidence scores average {successRate.toFixed(1)}%, indicating high-quality insights</li>
            <li>• Estimated payback period: 2.3 months based on current improvement velocity</li>
            <li>• Top improvement areas: Navigation clarity, CTA positioning, mobile responsiveness</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
