
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wand2, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Shield
} from 'lucide-react';
import { SidebarNavigationTabs } from './SidebarNavigationTabs';
import { SidebarMenuSection } from './SidebarMenuSection';
import { SidebarRecentAnalyses } from '../../sidebar/components/SidebarRecentAnalyses';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

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
  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat Analysis', icon: MessageSquare },
    { id: 'wizard', label: 'Analysis Wizard', icon: Wand2 },
  ];

  const supportItems = [
    { id: 'credits', label: 'Credits', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const adminItems = isOwner ? [
    { id: 'admin', label: 'Admin Panel', icon: Shield },
  ] : [];

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
