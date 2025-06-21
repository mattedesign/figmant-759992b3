
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useAuth } from '@/contexts/AuthContext';

interface BillingMetrics {
  totalRevenue: number;
  monthlyRecurring: number;
  activeSubscribers: number;
  churnRate: number;
  averageRevenuePerUser: number;
  creditsPurchased: number;
  creditsUsed: number;
  conversionRate: number;
}

export const BillingIntegration: React.FC = () => {
  const { credits } = useUserCredits();
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<BillingMetrics>({
    totalRevenue: 0,
    monthlyRecurring: 0,
    activeSubscribers: 0,
    churnRate: 0,
    averageRevenuePerUser: 0,
    creditsPurchased: 0,
    creditsUsed: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Simulate loading billing metrics
    const simulatedMetrics: BillingMetrics = {
      totalRevenue: 45750,
      monthlyRecurring: 12840,
      activeSubscribers: 342,
      churnRate: 3.2,
      averageRevenuePerUser: 37.50,
      creditsPurchased: 8750,
      creditsUsed: 6420,
      conversionRate: 12.8
    };
    
    setMetrics(simulatedMetrics);
  }, []);

  const recentTransactions = [
    {
      id: '1',
      user: 'user@example.com',
      type: 'subscription',
      amount: 49.00,
      status: 'completed',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      user: 'admin@company.com',
      type: 'credits',
      amount: 25.00,
      status: 'completed',
      date: new Date('2024-01-14')
    },
    {
      id: '3',
      user: 'developer@startup.io',
      type: 'subscription',
      amount: 99.00,
      status: 'failed',
      date: new Date('2024-01-13')
    }
  ];

  const creditUsagePercentage = metrics.creditsPurchased > 0 
    ? (metrics.creditsUsed / metrics.creditsPurchased) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Recurring</p>
                <p className="text-2xl font-bold">${metrics.monthlyRecurring.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <p className="text-2xl font-bold">{metrics.activeSubscribers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ARPU</p>
                <p className="text-2xl font-bold">${metrics.averageRevenuePerUser}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credit Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Credit Usage Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Credits Purchased</span>
                  <span className="font-medium">{metrics.creditsPurchased.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Credits Used</span>
                  <span className="font-medium">{metrics.creditsUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span className="font-medium">{(metrics.creditsPurchased - metrics.creditsUsed).toLocaleString()}</span>
                </div>
                <Progress value={creditUsagePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {creditUsagePercentage.toFixed(1)}% of purchased credits used
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Personal Credit Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Your Current Balance</span>
                  <span className="font-medium">{credits?.current_balance || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Purchased</span>
                  <span className="font-medium">{credits?.total_purchased || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Used</span>
                  <span className="font-medium">{credits?.total_used || 0}</span>
                </div>
                <Badge variant={credits?.current_balance ? 'default' : 'destructive'}>
                  {credits?.current_balance ? 'Active' : 'No Credits'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {transaction.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'destructive'}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.user}</p>
                    <p className="text-sm text-muted-foreground">{transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Health */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-600">{metrics.conversionRate}%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <p className="text-2xl font-bold text-yellow-600">{metrics.churnRate}%</p>
              <p className="text-sm text-muted-foreground">Churn Rate</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-600">94.2%</p>
              <p className="text-sm text-muted-foreground">Payment Success</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
