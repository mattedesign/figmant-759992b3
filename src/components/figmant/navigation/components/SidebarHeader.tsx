
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/c1e94897-1bb1-4fc6-9402-83245dcb008c.png" 
            alt="Logo" 
            className="h-6 w-6 object-contain flex-shrink-0"
          />
          {!isCollapsed && (
            <span className="font-semibold text-lg text-gray-900">figmant</span>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
