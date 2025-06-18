
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface SidebarUserSectionProps {
  profileName?: string;
}

export const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({
  profileName
}) => {
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {profileName || 'User'}
          </h2>
          <p className="text-sm text-gray-500">Personal Account</p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
