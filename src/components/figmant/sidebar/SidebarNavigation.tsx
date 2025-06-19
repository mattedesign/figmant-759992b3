
import React from 'react';
import { SidebarCollapseToggle } from './components/SidebarCollapseToggle';
import { SidebarTabsInterface } from './components/SidebarTabsInterface';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wand2, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Users,
  Package,
  Database,
  Cog
} from 'lucide-react';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner = false,
  isCollapsed,
  onToggleCollapse
}) => {
  const { analysisHistory } = useChatAnalysisHistory();

  // Don't show tabbed interface when collapsed
  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {/* Show minimal navigation when collapsed */}
          <div className="px-2 py-4 space-y-2">
            <button
              onClick={() => onSectionChange('dashboard')}
              className={`w-full p-2 rounded-lg ${activeSection === 'dashboard' ? 'bg-white' : 'hover:bg-white/50'}`}
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={() => onSectionChange('chat')}
              className={`w-full p-2 rounded-lg ${activeSection === 'chat' ? 'bg-white' : 'hover:bg-white/50'}`}
              title="Chat Analysis"
            >
              <MessageSquare className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={() => onSectionChange('wizard')}
              className={`w-full p-2 rounded-lg ${activeSection === 'wizard' ? 'bg-white' : 'hover:bg-white/50'}`}
              title="Analysis Wizard"
            >
              <Wand2 className="h-5 w-5 mx-auto" />
            </button>
          </div>
        </div>
        
        <SidebarCollapseToggle 
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </div>
    );
  }

  const mainMenuSections = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'chat', label: 'Chat Analysis', icon: MessageSquare },
        { id: 'wizard', label: 'Analysis Wizard', icon: Wand2 },
      ]
    }
  ];

  const supportSection = {
    title: 'Support',
    items: [
      { id: 'credits', label: 'Credits', icon: CreditCard },
      { id: 'preferences', label: 'Preferences', icon: Settings },
      { id: 'support', label: 'Help & Support', icon: HelpCircle },
    ]
  };

  const adminSections = isOwner ? [
    {
      title: 'Admin',
      items: [
        { id: 'admin', label: 'Admin Dashboard', icon: Users },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'assets', label: 'Assets', icon: Database },
        { id: 'settings', label: 'System Settings', icon: Cog },
      ]
    }
  ] : [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <SidebarTabsInterface 
          mainMenuSections={mainMenuSections}
          supportSection={supportSection}
          adminSections={adminSections}
          analysisHistory={analysisHistory}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>
    </div>
  );
};
