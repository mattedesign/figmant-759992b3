
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { navigationConfig } from '@/config/navigation';

interface NavigationMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { isOwner } = useAuth();

  // Mobile shows priority 1 items only to maintain clean interface
  const mainSections = navigationConfig.mainItems.filter(item => item.priority === 1);
  
  // Add admin section for owners
  const adminSections = isOwner ? navigationConfig.adminItems : [];
  
  const allSections = [...mainSections, ...adminSections];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {allSections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 text-base",
              activeSection === section.id 
                ? "bg-gray-100 text-gray-900 rounded-[12px]"
                : section.id === 'admin' 
                  ? "border border-orange-200 bg-orange-50 text-orange-700 rounded-[12px] hover:bg-orange-100"
                  : "hover:bg-gray-50 hover:rounded-[12px] text-gray-700"
            )}
            onClick={() => onSectionChange(section.id)}
          >
            <section.icon className="mr-3 h-5 w-5" />
            {section.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
