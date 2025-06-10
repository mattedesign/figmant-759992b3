
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, MousePointer, Clock, Target } from 'lucide-react';

export const AnalyticsOverview = () => {
  const metrics = [
    {
      title: 'Active Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Page Views',
      value: '18,392',
      change: '+8.2%',
      trend: 'up',
      icon: MousePointer,
    },
    {
      title: 'Avg. Session Duration',
      value: '3m 42s',
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '+1.8%',
      trend: 'up',
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metric.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>UX Health Score</CardTitle>
            <CardDescription>
              Overall user experience quality based on key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Score</span>
                <span className="text-2xl font-bold text-green-600">8.4/10</span>
              </div>
              <Progress value={84} className="w-full" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between">
                    <span>Navigation</span>
                    <span>9.1</span>
                  </div>
                  <Progress value={91} className="w-full h-2" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>Load Speed</span>
                    <span>7.8</span>
                  </div>
                  <Progress value={78} className="w-full h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Activity</CardTitle>
            <CardDescription>
              Current user behavior and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Users online now</span>
                <Badge variant="secondary">147 active</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Homepage</span>
                  <span>42 users</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Product Pages</span>
                  <span>38 users</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Checkout</span>
                  <span>12 users</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
