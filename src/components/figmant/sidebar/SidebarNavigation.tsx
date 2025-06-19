
import React from 'react';
import { SidebarMenuSection } from './components/SidebarMenuSection';
import { SidebarCollapseToggle } from './components/SidebarCollapseToggle';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner = false,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <SidebarMenuSection 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isOwner={isOwner}
          isCollapsed={isCollapsed}
        />
      </div>
      
      {/* Only show the collapse toggle at the bottom when collapsed */}
      {isCollapsed && (
        <SidebarCollapseToggle 
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}
    </div>
  );
};
