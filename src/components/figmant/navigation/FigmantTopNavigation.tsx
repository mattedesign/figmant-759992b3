
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Settings } from 'lucide-react';

interface FigmantTopNavigationProps {
  currentSection: string;
}

export const FigmantTopNavigation: React.FC<FigmantTopNavigationProps> = ({ currentSection }) => {
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'Quick Actions';
      case 'insights':
        return 'Design Insights';
      case 'premium-analysis':
        return 'Premium Analysis';
      case 'analysis':
        return 'All Analysis';
      case 'upload':
        return 'Upload Design';
      case 'processing':
        return 'Processing';
      case 'prompts':
        return 'Prompts';
      case 'history':
        return 'Analysis History';
      case 'analytics':
        return 'Performance Analytics';
      case 'profile':
        return 'Profile';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getSectionTitle(currentSection)}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
