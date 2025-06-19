
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
              borderRadius: '8px',
              background: 'var(--action-background-neutral-light_active, rgba(28, 34, 43, 0.05))',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <TabsTrigger 
              value="analysis" 
              style={{
                borderRadius: '6px',
                background: 'var(--Background-primary, #FFF)',
                boxShadow: '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)'
              }}
              className="data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              style={{
                borderRadius: '6px',
                background: 'var(--Background-primary, #FFF)',
                boxShadow: '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)'
              }}
              className="data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none"
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
