
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const handleToggle = () => {
    onToggleCollapse?.(!isCollapsed);
  };

  return (
    <div className={`p-4 border-b border-gray-200/30 ${isCollapsed ? 'flex flex-col items-center space-y-2' : 'flex items-center justify-between'}`}>
      {isCollapsed ? (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggle}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
          <div className="w-10 h-10 flex items-center justify-center">
            <Logo size="sm" className="w-8 h-8" variant="collapsed" />
          </div>
        </>
      ) : (
        <>
          <Logo size="md" className="w-auto" variant="expanded" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggle}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
