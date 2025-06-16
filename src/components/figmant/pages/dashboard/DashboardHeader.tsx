
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

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
  const { profile } = useAuth();
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d');
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Extract first name from full_name or use a fallback
  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'there';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="text-sm text-gray-500 mb-1">{formattedDate}</div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {getFirstName()}!
        </h1>
        {lastUpdated && (
          <Badge variant="outline" className="flex items-center gap-1 mt-2">
            <Calendar className="h-3 w-3" />
            Updated {format(lastUpdated, 'MMM dd, HH:mm')}
          </Badge>
        )}
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
