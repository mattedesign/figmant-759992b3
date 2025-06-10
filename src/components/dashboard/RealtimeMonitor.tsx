
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Users, MousePointer, Zap, Globe } from 'lucide-react';

export const RealtimeMonitor = () => {
  const [activeUsers, setActiveUsers] = useState(147);
  const [pageViews, setPageViews] = useState(8392);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
      setPageViews(prev => prev + Math.floor(Math.random() * 20));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const realtimeData = [
    {
      page: '/homepage',
      users: 42,
      avgTime: '2m 15s',
      bounceRate: '12%',
      status: 'healthy'
    },
    {
      page: '/products',
      users: 38,
      avgTime: '4m 32s',
      bounceRate: '8%',
      status: 'excellent'
    },
    {
      page: '/checkout',
      users: 12,
      avgTime: '1m 45s',
      bounceRate: '35%',
      status: 'warning'
    },
    {
      page: '/about',
      users: 8,
      avgTime: '3m 12s',
      bounceRate: '15%',
      status: 'healthy'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'healthy': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-green-500" />
              <span>Active now</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views Today</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-blue-500" />
              <span>Real-time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Traffic</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>International visitors</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Performance Monitor</CardTitle>
          <CardDescription>
            Real-time user behavior on key pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realtimeData.map((page) => (
              <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-muted-foreground">
                    {page.users} active users
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium">{page.avgTime}</div>
                    <div className="text-xs text-muted-foreground">Avg. Time</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{page.bounceRate}</div>
                    <div className="text-xs text-muted-foreground">Bounce Rate</div>
                  </div>
                  <div>
                    <Badge variant="secondary" className={getStatusColor(page.status)}>
                      {page.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            Where your users are coming from right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Direct</span>
              <div className="flex items-center space-x-2">
                <Progress value={45} className="w-24" />
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Search Engines</span>
              <div className="flex items-center space-x-2">
                <Progress value={32} className="w-24" />
                <span className="text-sm font-medium">32%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Social Media</span>
              <div className="flex items-center space-x-2">
                <Progress value={18} className="w-24" />
                <span className="text-sm font-medium">18%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Referrals</span>
              <div className="flex items-center space-x-2">
                <Progress value={5} className="w-24" />
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
