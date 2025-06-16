
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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
    <div className={`p-4 border-b border-gray-200/30 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      {isCollapsed ? (
        <div className="w-10 h-10 flex items-center justify-center">
          <img 
            src="/lovable-uploads/4b1400ea-3704-45a3-b6e8-6cf63812bd8e.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>
      ) : (
        <Logo size="md" className="w-auto" />
      )}
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleToggle}
        className={`h-8 w-8 text-gray-500 hover:text-gray-700 ${isCollapsed ? 'absolute top-4 right-4' : ''}`}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
};
