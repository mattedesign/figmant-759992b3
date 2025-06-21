
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Activity, DollarSign } from 'lucide-react';

interface UserStatsProps {
  stats?: {
    total_users: number;
    active_users: number;
    total_analyses: number;
    total_cost: number;
  };
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users.toLocaleString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users (30d)',
      value: stats.active_users.toLocaleString(),
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: 'Total Analyses',
      value: stats.total_analyses.toLocaleString(),
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Total Cost',
      value: `$${stats.total_cost.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
