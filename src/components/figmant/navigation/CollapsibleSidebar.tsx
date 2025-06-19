
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarNavigation } from './components/SidebarNavigation';
import { SidebarFooter } from './components/SidebarFooter';

interface CollapsibleSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <TooltipProvider>
      <div 
        className={cn(
          "h-full flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
        style={{
          borderRadius: '20px',
          border: '1px solid var(--Stroke-01, #ECECEC)',
          background: 'var(--Surface-01, #FCFCFC)'
        }}
      >
        <SidebarHeader 
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
        
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isCollapsed={isCollapsed}
        />

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </TooltipProvider>
  );
};
