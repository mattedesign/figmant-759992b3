
import React from 'react';
import { Target, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  selectedTab: 'overview' | 'insights' | 'credits';
  onTabChange: (tab: 'overview' | 'insights' | 'credits') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ selectedTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'insights', label: 'Insights', icon: Trophy },
    { id: 'credits', label: 'Credits', icon: Zap }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id as any)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            selectedTab === id
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
};
