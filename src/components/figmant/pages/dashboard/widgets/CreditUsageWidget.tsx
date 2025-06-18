import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreditPurchaseModal } from '@/components/modals/CreditPurchaseModal';

interface CreditUsageWidgetProps {
  userCredits?: {
    current_balance: number;
    total_used: number;
    total_purchased: number;
  };
  className?: string;
}

export const CreditUsageWidget: React.FC<CreditUsageWidgetProps> = ({
  userCredits,
  className
}) => {
  const [showCreditModal, setShowCreditModal] = useState(false);

  const creditMetrics = useMemo(() => {
    const current_balance = userCredits?.current_balance || 0;
    const total_used = userCredits?.total_used || 0;
    const total_purchased = userCredits?.total_purchased || 5; // Default welcome credits
    
    const usage_percentage = total_purchased > 0 ? 
      Math.round((total_used / total_purchased) * 100) : 0;
    
    const credits_remaining_percentage = total_purchased > 0 ? 
      Math.round((current_balance / total_purchased) * 100) : 0;
    
    // Determine status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (current_balance === 0) status = 'critical';
    else if (current_balance <= 2) status = 'warning';
    
    // Mock monthly usage trend (would come from analytics in production)
    const monthly_usage = Math.min(total_used, 15);
    const usage_trend = monthly_usage > 10 ? 'high' : 
                       monthly_usage > 5 ? 'moderate' : 'low';
    
    return {
      current_balance,
      total_used,
      total_purchased,
      usage_percentage,
      credits_remaining_percentage,
      status,
      monthly_usage,
      usage_trend
    };
  }, [userCredits]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    const baseClass = "h-4 w-4";
    switch (trend) {
      case 'high': return <TrendingUp className={cn(baseClass, "text-red-600")} />;
      case 'moderate': return <TrendingUp className={cn(baseClass, "text-orange-600")} />;
      default: return <TrendingUp className={cn(baseClass, "text-green-600")} />;
    }
  };

  const handleBuyCredits = () => {
    setShowCreditModal(true);
  };

  return (
    <>
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Credit Usage</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(creditMetrics.status)}
              <Badge variant="outline" className={getStatusColor(creditMetrics.status)}>
                {creditMetrics.status.charAt(0).toUpperCase() + creditMetrics.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Credit Balance Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {creditMetrics.current_balance}
              </div>
              <div className="text-sm text-muted-foreground">Credits Remaining</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {creditMetrics.total_used}
              </div>
              <div className="text-sm text-muted-foreground">Credits Used</div>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Credits Used</span>
              <span className="font-medium">{creditMetrics.usage_percentage}%</span>
            </div>
            <Progress 
              value={creditMetrics.usage_percentage} 
              className="h-2"
            />
            
            <div className="flex items-center justify-between text-sm">
              <span>Credits Remaining</span>
              <span className="font-medium">{creditMetrics.credits_remaining_percentage}%</span>
            </div>
            <Progress 
              value={creditMetrics.credits_remaining_percentage} 
              className="h-2"
            />
          </div>

          {/* Usage Analytics */}
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Monthly Usage</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(creditMetrics.usage_trend)}
                <span className="text-sm font-medium">{creditMetrics.monthly_usage} credits</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Trend: {creditMetrics.usage_trend} usage this month
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              size="sm" 
              className="flex-1"
              variant={creditMetrics.status === 'critical' ? 'default' : 'outline'}
              onClick={handleBuyCredits}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Credits
            </Button>
            
            <Button size="sm" variant="outline" className="flex-1">
              View History
            </Button>
          </div>

          {/* Status Messages */}
          {creditMetrics.status === 'critical' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-1">
                <AlertTriangle className="h-4 w-4" />
                No Credits Remaining
              </div>
              <p className="text-red-700 text-xs">
                Purchase more credits to continue analyzing designs.
              </p>
            </div>
          )}

          {creditMetrics.status === 'warning' && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 text-sm font-medium mb-1">
                <AlertTriangle className="h-4 w-4" />
                Low Credit Balance
              </div>
              <p className="text-orange-700 text-xs">
                Consider purchasing more credits to avoid interruptions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CreditPurchaseModal 
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
    </>
  );
};
