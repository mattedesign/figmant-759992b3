
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, FileText, MessageSquare } from 'lucide-react';

interface DashboardOverviewCardProps {
  dataStats: {
    totalAnalyses: number;
    completedAnalyses: number;
    pendingAnalyses: number;
    totalPrompts: number;
    totalNotes: number;
  };
}

export const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ dataStats }) => {
  const metrics = [
    {
      title: 'Total Analyses',
      value: dataStats.totalAnalyses,
      icon: FileText,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Completed',
      value: dataStats.completedAnalyses,
      icon: TrendingUp,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Prompts',
      value: dataStats.totalPrompts,
      icon: MessageSquare,
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      title: 'Notes Created',
      value: dataStats.totalNotes,
      icon: Activity,
      change: '+3%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-transparent border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {metric.change}
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
