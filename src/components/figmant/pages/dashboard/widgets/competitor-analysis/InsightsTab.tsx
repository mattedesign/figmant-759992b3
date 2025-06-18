
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { WidgetMetrics } from './types';

interface InsightsTabProps {
  widgetMetrics: WidgetMetrics;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ widgetMetrics }) => {
  return (
    <div className="space-y-4">
      {widgetMetrics.recent_comparisons.length > 0 ? (
        <div className="space-y-3">
          {widgetMetrics.recent_comparisons.map((comparison, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Comparison #{index + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Your Score:</span>
                  <Badge variant={comparison.your_score > comparison.competitor_avg ? "default" : "secondary"}>
                    {comparison.your_score}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs {comparison.competitor_avg}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="font-medium text-orange-600 mb-1">Improvement Areas:</div>
                  <ul className="space-y-1">
                    {comparison.improvement_areas.map((area, i) => (
                      <li key={i} className="text-muted-foreground">• {area}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-medium text-green-600 mb-1">Your Advantages:</div>
                  <ul className="space-y-1">
                    {comparison.competitive_advantage.map((advantage, i) => (
                      <li key={i} className="text-muted-foreground">• {advantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No competitor insights yet. Complete your first analysis to see comparisons.
          </p>
        </div>
      )}
    </div>
  );
};
