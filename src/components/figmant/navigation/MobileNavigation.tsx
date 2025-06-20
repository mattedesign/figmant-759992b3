
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsSmallMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { MobileNavigationHeader } from './components/MobileNavigationHeader';
import { NavigationMenu } from './components/NavigationMenu';
import { UserProfileSection } from './components/UserProfileSection';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSmallMobile = useIsSmallMobile();

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  const handleNavigationClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size={isSmallMobile ? "default" : "sm"} 
          className={`${isSmallMobile ? "h-10 w-10 p-0" : "h-9 w-9 p-0"} touch-manipulation`}
        >
          <Menu className={isSmallMobile ? "h-5 w-5" : "h-4 w-4"} />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className={`${isSmallMobile ? 'w-80' : 'w-72'} p-0 safe-left`}
      >
        <div className="flex flex-col h-full">
          <MobileNavigationHeader />
          {/* Main navigation sections - should match desktop exactly */}
          <div className="flex-1 overflow-y-auto">
            <NavigationMenu 
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
          {/* User profile section - only profile actions, no duplicate navigation */}
          <UserProfileSection onNavigate={handleNavigationClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
