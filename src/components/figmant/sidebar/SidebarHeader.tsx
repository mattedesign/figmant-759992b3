
import React from 'react';
import { Logo } from '@/components/common/Logo';

interface SidebarHeaderProps {
  isCollapsed?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  isCollapsed = false
}) => {
  return (
    <div className={`p-4 border-b border-gray-200/30 ${isCollapsed ? 'flex justify-center' : 'flex items-center justify-start'}`}>
      {isCollapsed ? (
        <div className="w-10 h-10 flex items-center justify-center">
          <Logo size="sm" className="w-8 h-8" variant="collapsed" />
        </div>
      ) : (
        <Logo size="md" className="w-auto" variant="expanded" />
      )}
    </div>
  );
};
