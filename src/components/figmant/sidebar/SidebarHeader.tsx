
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getHeaderClasses = () => {
    if (isTablet) {
      return "flex items-center justify-between px-3 py-3 border-b border-gray-200/30";
    }
    return "flex items-center justify-between px-4 py-4 border-b border-gray-200/30";
  };

  const getLogoClasses = () => {
    if (isTablet) {
      return "text-lg font-bold text-gray-900";
    }
    return "text-xl font-bold text-gray-900";
  };

  const getButtonSize = () => {
    if (isTablet) {
      return "sm";
    }
    return "sm";
  };

  const getIconSize = () => {
    if (isTablet) {
      return "h-4 w-4";
    }
    return "h-4 w-4";
  };

  return (
    <div className={getHeaderClasses()}>
      {!isCollapsed && (
        <h1 className={getLogoClasses()}>
          figmant
        </h1>
      )}
      
      <Button
        variant="ghost"
        size={getButtonSize()}
        onClick={() => onToggleCollapse(!isCollapsed)}
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        {isCollapsed ? (
          <PanelRight className={getIconSize()} />
        ) : (
          <PanelLeft className={getIconSize()} />
        )}
      </Button>
    </div>
  );
};
