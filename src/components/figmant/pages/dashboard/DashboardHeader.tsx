
import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardHeader: React.FC = () => {
  const { profile } = useAuth();

  // Get current date and time
  const now = new Date();
  const currentDate = format(now, 'EEEE, MMMM d');
  const currentHour = now.getHours();

  // Determine greeting based on time of day (Title Case)
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's first name from profile
  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'there'; // fallback if no name available
  };

  return (
    <div className="flex-none px-16 py-6 pb-4" style={{ backgroundColor: 'transparent' }}>
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">{currentDate}</div>
        <h1 className="text-2xl text-gray-900">
          <span style={{ fontWeight: 'normal', color: '#455468' }}>{getGreeting()} </span>
          <span className="font-semibold">{getFirstName()}</span>
        </h1>
      </div>
    </div>
  );
};
