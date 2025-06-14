
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sectionConfig } from './config/sectionConfig';
import { NavigationSidebar } from './components/NavigationSidebar';

interface SecondaryNavigationProps {
  activeSection: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SecondaryNavigation = ({ activeSection, activeTab, onTabChange }: SecondaryNavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const config = sectionConfig[activeSection as keyof typeof sectionConfig];

  if (!config) {
    return (
      <div className={`${isCollapsed ? 'w-0' : 'w-64'} h-full bg-card border-r border-border flex flex-col overflow-hidden transition-all duration-300`}>
        {!isCollapsed && (
          <>
            <div className="flex-none p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-muted-foreground">
                Select a section from the left sidebar
              </div>
            </div>
          </>
        )}
        {isCollapsed && (
          <div className="h-full flex items-start pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="h-6 w-6 p-0 hover:bg-muted ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <NavigationSidebar 
      config={config}
      activeTab={activeTab}
      onTabChange={onTabChange}
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    />
  );
};
