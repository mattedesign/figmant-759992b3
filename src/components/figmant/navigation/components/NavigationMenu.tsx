
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { navigationConfig } from '@/config/navigation';
import { useIsMobile, useIsSmallMobile } from '@/hooks/use-mobile';

interface NavigationMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { isOwner } = useAuth();
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();

  // Show all priority 1 items consistently across devices
  const mainSections = navigationConfig.mainItems.filter(item => item.priority === 1);
  
  // Add admin section for owners
  const adminSections = isOwner ? navigationConfig.adminItems : [];
  
  const allSections = [...mainSections, ...adminSections];

  const getButtonClasses = (sectionId: string) => {
    const baseClasses = `w-full justify-start ${isSmallMobile ? 'h-14 text-base px-4' : isMobile ? 'h-12 text-base px-3' : 'h-12 text-base'} touch-manipulation`;
    
    if (activeSection === sectionId) {
      return cn(baseClasses, "bg-gray-100 text-gray-900 rounded-[12px]");
    }
    
    if (sectionId === 'admin') {
      return cn(baseClasses, "border border-orange-200 bg-orange-50 text-orange-700 rounded-[12px] hover:bg-orange-100");
    }
    
    return cn(baseClasses, "hover:bg-gray-50 hover:rounded-[12px] text-gray-700");
  };

  const getIconClasses = () => {
    if (isSmallMobile) {
      return "mr-4 h-6 w-6";
    }
    return "mr-3 h-5 w-5";
  };

  return (
    <div className={`px-3 sm:px-4 ${isSmallMobile ? 'py-6' : 'py-4'}`}>
      <div className={isSmallMobile ? "space-y-2" : "space-y-1"}>
        {allSections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            className={getButtonClasses(section.id)}
            onClick={() => onSectionChange(section.id)}
          >
            <section.icon className={getIconClasses()} />
            <span className="font-medium">{section.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
