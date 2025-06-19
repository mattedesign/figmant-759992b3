
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

interface SidebarHeaderProps {
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  isCollapsed = false,
  onToggleCollapse
}) => {
  return (
    <div className={`p-4 border-b border-gray-200/30 ${isCollapsed ? 'flex items-center justify-center' : 'flex items-center justify-between'}`}>
      {isCollapsed ? (
        // Only show collapse toggle for collapsed state, logo is now at bottom
        onToggleCollapse && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onToggleCollapse(!isCollapsed)}
            className="w-9 h-9 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent flex items-center justify-center"
          >
            <PanelRight className="h-9 w-9" />
          </Button>
        )
      ) : (
        <>
          <Logo size="md" className="w-auto" variant="expanded" />
          {onToggleCollapse && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onToggleCollapse(!isCollapsed)}
              className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
