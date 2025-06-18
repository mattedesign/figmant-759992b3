
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarCollapsedViewProps {
  mainMenuItems: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const SidebarCollapsedView: React.FC<SidebarCollapsedViewProps> = ({
  mainMenuItems,
  activeSection,
  onSectionChange,
  onToggleCollapse
}) => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col py-6">
      <div className="p-2 space-y-2 flex-1">
        {mainMenuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={cn(
              "w-10 h-10 p-0",
              activeSection === item.id 
                ? "bg-white text-[#3D4A5C]" 
                : "hover:bg-white hover:text-[#3D4A5C]"
            )}
            onClick={() => onSectionChange(item.id)}
            title={item.label}
          >
            <item.icon className={cn(
              "h-4 w-4",
              activeSection === item.id 
                ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                : "text-[#455468]"
            )} />
          </Button>
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-200/30 flex justify-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onToggleCollapse(false)}
          className="w-10 h-10 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
        >
          <PanelLeftOpen className="h-9 w-9" />
        </Button>
      </div>
    </div>
  );
};
