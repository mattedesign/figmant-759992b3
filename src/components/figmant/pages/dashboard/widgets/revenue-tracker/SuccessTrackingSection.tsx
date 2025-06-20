
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SuccessMetric } from './types';

interface SuccessTrackingSectionProps {
  successMetrics: SuccessMetric[];
}

export const SuccessTrackingSection: React.FC<SuccessTrackingSectionProps> = ({
  successMetrics
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Success Tracking</h3>
        <Badge variant="outline" className="text-xs">
          Live Metrics
        </Badge>
      </div>
      
      <div className="space-y-3">
        {successMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {metric.percentage_change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <div>
                <div className="font-medium text-sm capitalize">
                  {metric.metric.replace('_', ' ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.before}% → {metric.after}%
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-semibold ${
                metric.percentage_change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.percentage_change > 0 ? '+' : ''}{metric.percentage_change.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                vs. baseline
              </div>
            </div>
          </div>
        ))}
        
        {successMetrics.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No tracked metrics yet. Complete analyses to see success tracking.
          </div>
        )}
      </div>
    </div>
  );
};
