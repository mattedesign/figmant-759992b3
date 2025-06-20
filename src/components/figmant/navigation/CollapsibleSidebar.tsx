
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarNavigation } from './components/SidebarNavigation';
import { SidebarFooter } from './components/SidebarFooter';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isOwner } = useAuth();

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "h-full transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
        style={{
          borderRadius: '20px',
          border: '1px solid var(--Stroke-01, #ECECEC)',
          backgroundColor: isCollapsed ? '#F8F9FA' : 'white'
        }}
      >
        <SidebarHeader 
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
        
        <div className="flex-1 overflow-y-auto">
          <SidebarNavigation 
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            isCollapsed={isCollapsed}
            isOwner={isOwner}
          />
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </TooltipProvider>
  );
};
