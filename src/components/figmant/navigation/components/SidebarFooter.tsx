
import React from 'react';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex-none p-4 border-t border-gray-200">
      <div className="text-xs text-gray-500 text-center">
        Figmant v2.0
      </div>
    </div>
  );
};
