
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ArrowRight } from 'lucide-react';
import { WidgetMetrics } from './types';

interface OverviewTabProps {
  widgetMetrics: WidgetMetrics;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ widgetMetrics }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {widgetMetrics.analyses_completed}
          </div>
          <div className="text-xs text-muted-foreground">Analyses Completed</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {widgetMetrics.competitor_insights_generated}
          </div>
          <div className="text-xs text-muted-foreground">Insights Generated</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {widgetMetrics.actionable_recommendations}
          </div>
          <div className="text-xs text-muted-foreground">Recommendations</div>
        </div>
      </div>

      {widgetMetrics.analyses_completed === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
          <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="font-semibold text-sm mb-2">No Competitor Analyses Yet</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Analyze competitor websites to gain strategic insights
          </p>
          <Button size="sm">
            Start Competitor Analysis
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
