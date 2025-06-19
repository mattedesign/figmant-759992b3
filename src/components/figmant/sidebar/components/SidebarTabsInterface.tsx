
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarMenuSection } from './SidebarMenuSection';
import { SidebarRecentAnalyses } from './SidebarRecentAnalyses';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
}

interface SidebarTabsInterfaceProps {
  mainMenuSections: MenuSection[];
  supportSection: MenuSection;
  adminSections: MenuSection[];
  analysisHistory: SavedChatAnalysis[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SidebarTabsInterface: React.FC<SidebarTabsInterfaceProps> = ({
  mainMenuSections,
  supportSection,
  adminSections,
  analysisHistory,
  activeSection,
  onSectionChange
}) => {
  const allAnalysisSections = [
    ...mainMenuSections,
    supportSection,
    ...adminSections
  ];

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="analysis" className="flex flex-col h-full">
        {/* Fixed tabs header */}
        <div className="flex-shrink-0 px-4 mb-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-white">
              Recent
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="analysis" className="h-full m-0 overflow-y-auto">
            <div className="space-y-6">
              <SidebarMenuSection
                sections={allAnalysisSections}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="h-full m-0 flex flex-col">
            <SidebarRecentAnalyses
              analysisHistory={analysisHistory}
              onSectionChange={onSectionChange}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
