
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle } from 'lucide-react';
import { SuccessMetric } from './types';

interface SuccessTrackingSectionProps {
  successMetrics: SuccessMetric[];
}

export const SuccessTrackingSection: React.FC<SuccessTrackingSectionProps> = ({
  successMetrics
}) => {
  if (successMetrics.length === 0) {
    return null;
  }

  const suggestions_implemented = successMetrics.length;
  const total_percentage_improvement = successMetrics.reduce((sum, metric) => 
    sum + metric.percentage_change, 0) / successMetrics.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Success Tracking</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Suggestions Implemented</span>
            <Badge variant="outline">
              <CheckCircle className="h-3 w-3 mr-1" />
              {suggestions_implemented}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Avg Improvement</span>
            <span className="text-sm font-semibold text-green-600">
              +{total_percentage_improvement.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          {successMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="capitalize">{metric.metric.replace('_', ' ')}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {metric.before}% → {metric.after}%
                </span>
                <Badge variant="secondary" className="text-xs">
                  +{metric.percentage_change.toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
