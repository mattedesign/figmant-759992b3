
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
    <div className="px-4 mb-4">
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-white">
            Analysis
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-white">
            Recent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="mt-4 space-y-6">
          <SidebarMenuSection
            sections={allAnalysisSections}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        </TabsContent>
        
        <TabsContent value="recent" className="mt-4 h-96">
          <SidebarRecentAnalyses
            analysisHistory={analysisHistory}
            onSectionChange={onSectionChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
