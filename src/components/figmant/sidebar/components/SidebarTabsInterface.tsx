
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
        <div 
          style={{
            display: 'flex',
            padding: '12px 16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderTop: '1px solid var(--Stroke-01, #ECECEC)'
          }}
        >
          <TabsList 
            className="grid w-full grid-cols-2"
            style={{
              borderRadius: '12px',
              border: '1px solid var(--Stroke-02, #E2E2E2)',
              background: 'var(--Surface-03, #F1F1F1)',
              boxShadow: '0px 1px 1.9px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)) inset'
            }}
          >
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-[var(--Surface-01,#FCFCFC)] data-[state=active]:shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset] data-[state=active]:rounded-[8px]"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-[var(--Surface-01,#FCFCFC)] data-[state=active]:shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset] data-[state=active]:rounded-[8px]"
            >
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
