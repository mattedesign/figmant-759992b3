
import React from 'react';
import { SidebarCollapseToggle } from './components/SidebarCollapseToggle';
import { SidebarTabsInterface } from './components/SidebarTabsInterface';
import { SidebarCollapsedView } from './components/SidebarCollapsedView';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wand2, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Shield
} from 'lucide-react';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  // Added profile props for collapsed view
  profile?: any;
  user?: any;
  subscription?: any;
  signOut?: () => Promise<void>;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner = false,
  isCollapsed,
  onToggleCollapse,
  profile,
  user,
  subscription,
  signOut
}) => {
  const { data: analysisHistory = [] } = useChatAnalysisHistory();

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

  // Show collapsed view when sidebar is collapsed
  if (isCollapsed) {
    return (
      <SidebarCollapsedView
        mainMenuItems={mainMenuItems}
        supportItems={supportItems}
        adminItems={adminItems}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onToggleCollapse={onToggleCollapse}
        isOwner={isOwner}
        profile={profile}
        user={user}
        subscription={subscription}
        signOut={signOut || (() => Promise.resolve())}
      />
    );
  }

  const mainMenuSections = [
    {
      items: mainMenuItems
    }
  ];

  const supportSection = {
    title: 'Support',
    items: supportItems
  };

  // Simplified admin section with just one item
  const adminSections = isOwner ? [
    {
      title: 'Admin',
      items: adminItems
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
