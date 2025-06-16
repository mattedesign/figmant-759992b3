
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardHeaderProps {
  dataStats: any;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dataStats,
  lastUpdated,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your analyses.
          </p>
          {lastUpdated && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Updated {format(lastUpdated, 'MMM dd, HH:mm')}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>{dataStats.totalAnalyses} analyses</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{dataStats.completionRate}% complete</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};
