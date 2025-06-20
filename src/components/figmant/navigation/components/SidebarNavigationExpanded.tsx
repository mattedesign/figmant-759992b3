
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SidebarNavigationTabs } from './SidebarNavigationTabs';
import { SidebarMenuSection } from './SidebarMenuSection';
import { SidebarRecentAnalyses } from '../../sidebar/components/SidebarRecentAnalyses';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { navigationConfig } from '@/config/navigation';

interface SidebarNavigationExpandedProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner?: boolean;
  allAnalyses: SavedChatAnalysis[];
}

export const SidebarNavigationExpanded: React.FC<SidebarNavigationExpandedProps> = ({
  activeTab,
  onTabChange,
  activeSection,
  onSectionChange,
  isOwner = false,
  allAnalyses
}) => {
  // Use unified navigation configuration
  const mainMenuItems = navigationConfig.mainItems.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon
  }));

  const supportItems = navigationConfig.supportItems.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon
  }));

  const adminItems = isOwner ? navigationConfig.adminItems.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon
  })) : [];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'white' }}>
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        <SidebarNavigationTabs activeTab={activeTab} onTabChange={onTabChange} />
        
        <div className="flex-1 min-h-0 overflow-y-auto">
          <TabsContent value="menu" className="h-full m-0 p-4 space-y-6">
            <SidebarMenuSection
              items={mainMenuItems}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />

            <SidebarMenuSection
              title="Support"
              items={supportItems}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />

            {adminItems.length > 0 && (
              <SidebarMenuSection
                title="Admin"
                items={adminItems}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="h-full m-0 flex flex-col">
            <SidebarRecentAnalyses
              analysisHistory={allAnalyses}
              onSectionChange={onSectionChange}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
