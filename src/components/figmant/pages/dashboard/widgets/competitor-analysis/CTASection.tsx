
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { WidgetMetrics } from './types';

interface CTASectionProps {
  widgetMetrics: WidgetMetrics;
}

export const CTASection: React.FC<CTASectionProps> = ({ widgetMetrics }) => {
  if (widgetMetrics.analyses_completed === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="text-sm text-muted-foreground">
        Analyze {5 - Math.min(widgetMetrics.analyses_completed, 5)} more competitors for deeper insights
      </div>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
        <Eye className="h-4 w-4 mr-2" />
        Analyze Competitor
      </Button>
    </div>
  );
};
