
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { QuickFilters } from '@/hooks/filters/types';

interface QuickActionsSectionProps {
  quickFilters: QuickFilters;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ quickFilters }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={quickFilters.today}>
        Today
      </Button>
      <Button variant="outline" size="sm" onClick={quickFilters.thisWeek}>
        This Week
      </Button>
      <Button variant="outline" size="sm" onClick={quickFilters.thisMonth}>
        This Month
      </Button>
      <Button variant="outline" size="sm" onClick={quickFilters.highConfidence}>
        <TrendingUp className="h-3 w-3 mr-1" />
        High Confidence
      </Button>
      <Button variant="outline" size="sm" onClick={quickFilters.lowConfidence}>
        <TrendingDown className="h-3 w-3 mr-1" />
        Needs Review
      </Button>
    </div>
  );
};
