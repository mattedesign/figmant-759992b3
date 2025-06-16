
import React, { useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface SidebarHeaderProps {
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggleCollapse?.(newCollapsed);
  };

  return (
    <div className="p-4 border-b border-gray-200/30 flex items-center justify-between">
      <Logo size="md" className="w-auto" />
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleToggle}
        className="h-8 w-8 text-gray-500 hover:text-gray-700"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
};
