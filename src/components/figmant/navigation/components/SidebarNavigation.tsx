
import React from 'react';
import { SidebarItem } from './SidebarItem';
import { sidebarItems } from './sidebarConfig';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed
}) => {
  return (
    <div className="flex-1 p-2 space-y-1 overflow-y-auto">
      {sidebarItems.map((item) => (
        <SidebarItem
          key={item.id}
          item={item}
          isActive={activeSection === item.id}
          isCollapsed={isCollapsed}
          onSectionChange={onSectionChange}
        />
      ))}
    </div>
  );
};
