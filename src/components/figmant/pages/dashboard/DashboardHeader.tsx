
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, Zap, BarChart3 } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  dataStats: any;
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dataStats,
  lastUpdated,
  onRefresh,
  isRefreshing
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getHeaderClasses = () => {
    if (isMobile) {
      return "space-y-4";
    }
    if (isTablet) {
      return "space-y-4";
    }
    return "space-y-6";
  };

  const getTitleClasses = () => {
    if (isMobile) {
      return "text-xl font-bold text-gray-900";
    }
    if (isTablet) {
      return "text-2xl font-bold text-gray-900";
    }
    return "text-3xl font-bold text-gray-900";
  };

  const getSubtitleClasses = () => {
    if (isMobile) {
      return "text-sm text-gray-600";
    }
    return "text-gray-600";
  };

  const getStatsGridClasses = () => {
    if (isMobile) {
      return "grid grid-cols-2 gap-3";
    }
    if (isTablet) {
      return "grid grid-cols-2 lg:grid-cols-4 gap-4";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
  };

  const getStatCardClasses = () => {
    if (isMobile) {
      return "bg-white p-3 rounded-lg border border-gray-200 shadow-sm";
    }
    return "bg-white p-4 rounded-lg border border-gray-200 shadow-sm";
  };

  const getStatValueClasses = () => {
    if (isMobile) {
      return "text-lg font-bold text-gray-900";
    }
    if (isTablet) {
      return "text-xl font-bold text-gray-900";
    }
    return "text-2xl font-bold text-gray-900";
  };

  const getStatLabelClasses = () => {
    if (isMobile) {
      return "text-xs text-gray-600";
    }
    return "text-sm text-gray-600";
  };

  const getIconSize = () => {
    if (isMobile) {
      return "h-4 w-4";
    }
    return "h-5 w-5";
  };

  // Format numbers for mobile display
  const formatNumber = (num: number) => {
    if (isMobile && num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    if (isMobile) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleString();
  };

  return (
    <div className={getHeaderClasses()}>
      {/* Header with title and refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={getTitleClasses()}>
            Dashboard
          </h1>
          <p className={getSubtitleClasses()}>
            {isMobile ? 'Analytics overview' : 'Your comprehensive analytics and performance overview'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {lastUpdated && !isMobile && (
            <span className="text-xs text-gray-500">
              Last updated: {formatTime(lastUpdated)}
            </span>
          )}
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`${getIconSize()} ${isRefreshing ? 'animate-spin' : ''}`} />
            {!isMobile && 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Grid - Responsive layout */}
      <div className={getStatsGridClasses()}>
        <div className={getStatCardClasses()}>
          <div className="flex items-center justify-between">
            <div>
              <div className={getStatValueClasses()}>
                {formatNumber(dataStats?.totalAnalyses || 0)}
              </div>
              <div className={getStatLabelClasses()}>
                {isMobile ? 'Analyses' : 'Total Analyses'}
              </div>
            </div>
            <BarChart3 className={`${getIconSize()} text-blue-600`} />
          </div>
        </div>

        <div className={getStatCardClasses()}>
          <div className="flex items-center justify-between">
            <div>
              <div className={getStatValueClasses()}>
                {Math.round(dataStats?.activityScore || 0)}%
              </div>
              <div className={getStatLabelClasses()}>
                {isMobile ? 'Success' : 'Success Rate'}
              </div>
            </div>
            <TrendingUp className={`${getIconSize()} text-green-600`} />
          </div>
        </div>

        <div className={getStatCardClasses()}>
          <div className="flex items-center justify-between">
            <div>
              <div className={getStatValueClasses()}>
                {formatNumber(dataStats?.totalInsights || 0)}
              </div>
              <div className={getStatLabelClasses()}>
                {isMobile ? 'Insights' : 'Insights Generated'}
              </div>
            </div>
            <Zap className={`${getIconSize()} text-yellow-600`} />
          </div>
        </div>

        <div className={getStatCardClasses()}>
          <div className="flex items-center justify-between">
            <div>
              <div className={getStatValueClasses()}>
                {formatNumber(dataStats?.activeUsers || 1)}
              </div>
              <div className={getStatLabelClasses()}>
                {isMobile ? 'Users' : 'Active Users'}
              </div>
            </div>
            <Users className={`${getIconSize()} text-purple-600`} />
          </div>
        </div>
      </div>

      {/* Mobile last updated info */}
      {isMobile && lastUpdated && (
        <div className="text-xs text-gray-500 text-center">
          Last updated: {formatTime(lastUpdated)}
        </div>
      )}
    </div>
  );
};
