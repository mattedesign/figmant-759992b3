
import { sectionConfig } from './config/sectionConfig';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TabContentRenderer } from './components/TabContentRenderer';

interface SecondaryNavigationProps {
  activeSection: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SecondaryNavigation = ({ activeSection, activeTab, onTabChange }: SecondaryNavigationProps) => {
  const config = sectionConfig[activeSection as keyof typeof sectionConfig];

  if (!config) {
    return (
      <div className="flex flex-1">
        <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>
          <div className="flex-1 p-4">
            <div className="text-muted-foreground">
              Select a section from the left sidebar
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No content available</h3>
            <p className="text-muted-foreground">
              Please select a valid section from the left sidebar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <NavigationSidebar 
        config={config}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <TabContentRenderer activeTab={activeTab} />
    </div>
  );
};
