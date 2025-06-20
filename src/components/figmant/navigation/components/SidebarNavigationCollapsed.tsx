
import React from 'react';
import { Button } from '@/components/ui/button';
import { navigationConfig } from '@/config/navigation';

interface SidebarNavigationCollapsedProps {
  onSectionChange: (section: string) => void;
  isOwner?: boolean;
}

export const SidebarNavigationCollapsed: React.FC<SidebarNavigationCollapsedProps> = ({
  onSectionChange,
  isOwner = false
}) => {
  // Use unified navigation configuration
  const mainMenuItems = navigationConfig.mainItems;
  const supportItems = navigationConfig.supportItems;
  const adminItems = isOwner ? navigationConfig.adminItems : [];

  const allItems = [...mainMenuItems, ...supportItems, ...adminItems];

  return (
    <div className="flex flex-col items-center py-4 space-y-3" style={{ backgroundColor: '#F8F9FA' }}>
      {allItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="icon"
          onClick={() => onSectionChange(item.id)}
          className="w-10 h-10 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
          title={item.label}
        >
          <item.icon 
            className="h-5 w-5"
            color="#6B7280"
          />
        </Button>
      ))}
    </div>
  );
};
