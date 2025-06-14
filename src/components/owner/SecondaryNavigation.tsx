
import { sectionConfig } from './config/sectionConfig';
import { NavigationSidebar } from './components/NavigationSidebar';

interface SecondaryNavigationProps {
  activeSection: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SecondaryNavigation = ({ activeSection, activeTab, onTabChange }: SecondaryNavigationProps) => {
  const config = sectionConfig[activeSection as keyof typeof sectionConfig];

  if (!config) {
    return (
      <div className="w-64 h-full bg-card border-r border-border flex flex-col overflow-hidden">
        <div className="flex-none p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-muted-foreground">
            Select a section from the left sidebar
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavigationSidebar 
      config={config}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
};
