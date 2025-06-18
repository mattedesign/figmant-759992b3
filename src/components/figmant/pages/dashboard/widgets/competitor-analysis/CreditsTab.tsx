
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, BarChart, AlertCircle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetMetrics } from './types';
import { getTrendColor } from './utils';

interface CreditsTabProps {
  widgetMetrics: WidgetMetrics;
}

export const CreditsTab: React.FC<CreditsTabProps> = ({ widgetMetrics }) => {
  const getUsageTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {widgetMetrics.credit_usage.current_credits}
          </div>
          <div className="text-xs text-muted-foreground">Credits Remaining</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {widgetMetrics.credit_usage.credits_used_this_month}
          </div>
          <div className="text-xs text-muted-foreground">Used This Month</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Usage Trend</span>
          <div className="flex items-center gap-2">
            {getUsageTrendIcon(widgetMetrics.credit_usage.usage_trend)}
            <span className={cn("text-sm font-medium", getTrendColor(widgetMetrics.credit_usage.usage_trend))}>
              {widgetMetrics.credit_usage.usage_trend}
            </span>
          </div>
        </div>

        <Progress 
          value={(widgetMetrics.credit_usage.credits_used_this_month / 25) * 100} 
          className="h-2"
        />
        
        <div className="text-xs text-muted-foreground text-center">
          {widgetMetrics.credit_usage.credits_used_this_month} of 25 monthly credits used
        </div>
      </div>

      {widgetMetrics.credit_usage.upgrade_recommendation && (
        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Upgrade Recommended</span>
          </div>
          <p className="text-xs text-orange-700 mb-3">
            {widgetMetrics.credit_usage.current_credits < 3 
              ? "You're running low on credits. Upgrade for unlimited competitor analyses."
              : "Heavy usage detected. Upgrade for unlimited analyses and priority support."
            }
          </p>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      )}
    </div>
  );
};
