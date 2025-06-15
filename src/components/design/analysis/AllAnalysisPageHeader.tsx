
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Grid, List } from 'lucide-react';

interface AllAnalysisPageHeaderProps {
  viewMode: 'grouped' | 'table';
  onViewModeChange: (mode: 'grouped' | 'table') => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  filteredGroupedAnalysesCount: number;
  totalGroupedAnalysesCount: number;
  filteredAnalysesCount: number;
  totalAnalysesCount: number;
}

export const AllAnalysisPageHeader: React.FC<AllAnalysisPageHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onManualRefresh,
  isRefreshing,
  filteredGroupedAnalysesCount,
  totalGroupedAnalysesCount,
  filteredAnalysesCount,
  totalAnalysesCount
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Analysis</h1>
        <p className="text-muted-foreground">
          View and manage all your design analyses in one place
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grouped' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grouped')}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Grouped
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Table
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <div className="text-sm text-muted-foreground">
          {viewMode === 'grouped' 
            ? `${filteredGroupedAnalysesCount} of ${totalGroupedAnalysesCount} groups`
            : `${filteredAnalysesCount} of ${totalAnalysesCount} analyses`
          }
        </div>
      </div>
    </div>
  );
};
