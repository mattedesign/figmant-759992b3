
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-8 py-8 border-b border-gray-100 bg-white">
      <div>
        <div className="text-sm font-medium text-gray-500 mb-2">{formattedDate}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="font-light">{getGreeting()}</span>, <span className="font-bold">{getFirstName()}</span>
        </h1>
        {lastUpdated && (
          <Badge variant="outline" className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700">
            <Calendar className="h-3 w-3" />
            Updated {format(lastUpdated, 'MMM dd, HH:mm')}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        {/* Enhanced quick stats */}
        <div className="hidden lg:flex items-center gap-8 text-sm">
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900">{dataStats.totalAnalyses}</div>
              <div className="text-blue-600">Total analyses</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="font-semibold text-emerald-900">{dataStats.completionRate}%</div>
              <div className="text-emerald-600">Success rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
