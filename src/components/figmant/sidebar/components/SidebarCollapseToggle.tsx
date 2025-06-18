
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SidebarCollapseToggleProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const SidebarCollapseToggle: React.FC<SidebarCollapseToggleProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  if (isCollapsed) {
    return (
      <div className="p-2 border-t border-gray-200/30 flex justify-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onToggleCollapse(!isCollapsed)}
          className="w-10 h-10 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
        >
          <PanelLeftOpen className="h-9 w-9" />
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200/30 mt-4">
      <Button 
        variant="ghost"
        onClick={() => onToggleCollapse(!isCollapsed)}
        className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
      >
        <PanelLeftClose className="h-4 w-4 mr-3" />
        <span className="text-sm font-medium">Collapse</span>
      </Button>
    </div>
  );
};
