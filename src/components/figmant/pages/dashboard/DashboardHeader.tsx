
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  dataStats: any;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated
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
    if (profile?.full_name && profile.full_name.trim()) {
      const firstName = profile.full_name.split(' ')[0].trim();
      return firstName || 'there';
    }
    // If no full_name, try to extract from email
    if (profile?.email) {
      const emailName = profile.email.split('@')[0];
      // Capitalize first letter and return if it looks like a name
      if (emailName && emailName.length > 0) {
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }
    }
    return 'there';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-[12px] pt-2">
      <div>
        <div className="text-sm text-gray-500 mb-1">{formattedDate}</div>
        <h1 className="text-[24px] text-gray-900">
          <span className="font-normal">{getGreeting()}</span>, <span className="font-bold">{getFirstName()}</span>
        </h1>
        {lastUpdated && (
          <Badge variant="outline" className="flex items-center gap-1 mt-2">
            <Calendar className="h-3 w-3" />
            Updated {format(lastUpdated, 'MMM dd, HH:mm')}
          </Badge>
        )}
      </div>
    </div>
  );
};
