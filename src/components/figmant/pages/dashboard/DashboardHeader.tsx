
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, Clock } from 'lucide-react';

interface DashboardHeaderProps {
  dataStats?: {
    totalAnalyses: number;
    completedAnalyses: number;
    pendingAnalyses: number;
    totalPrompts: number;
    totalNotes: number;
  };
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
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never updated';
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just updated';
    if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    
    return `Updated ${date.toLocaleDateString()}`;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        {dataStats && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{dataStats.totalAnalyses} analyses</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {dataStats && (
          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <span className="text-green-600 font-medium">{dataStats.completedAnalyses} completed</span>
            <span className="text-orange-600 font-medium">{dataStats.pendingAnalyses} pending</span>
            <span className="text-blue-600 font-medium">{dataStats.totalPrompts} prompts</span>
          </div>
        )}
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};
