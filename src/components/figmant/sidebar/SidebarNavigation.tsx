
import React from 'react';
import { 
  MessageSquare,
  Sparkles, 
  Lightbulb, 
  CreditCard,
  HelpCircle,
  Users,
  Package,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { SidebarUserSection } from './components/SidebarUserSection';
import { SidebarTabsInterface } from './components/SidebarTabsInterface';
import { SidebarSearchBar } from './components/SidebarSearchBar';
import { SidebarCollapseToggle } from './components/SidebarCollapseToggle';
import { SidebarCollapsedView } from './components/SidebarCollapsedView';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

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

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { profile } = useAuth();
  const { data: analysisHistory = [] } = useChatAnalysisHistory();

  // Main menu sections
  const mainMenuSections: MenuSection[] = [
    {
      items: [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'wizard', label: 'Wizard', icon: Sparkles },
        { id: 'prompts', label: 'Prompts', icon: Lightbulb },
        { id: 'credits', label: 'Credits', icon: CreditCard },
      ]
    }
  ];

  // Support section
  const supportSection: MenuSection = {
    items: [
      { id: 'support', label: 'Support', icon: HelpCircle }
    ]
  };

  // Admin sections (only for owners)
  const adminSections: MenuSection[] = isOwner ? [
    {
      title: 'Admin',
      items: [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'assets', label: 'Assets', icon: Lightbulb },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ]
    }
  ] : [];

  if (isCollapsed) {
    return (
      <SidebarCollapsedView
        mainMenuItems={mainMenuSections[0].items}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onToggleCollapse={onToggleCollapse!}
      />
    );
  }

  return (
    <div className="flex flex-col py-6 h-full overflow-hidden">
      <div className="flex-shrink-0">
        <SidebarUserSection 
          profileName={profile?.full_name}
        />
      </div>

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

      <div className="flex-shrink-0">
        <SidebarSearchBar />
        
        <SidebarCollapseToggle
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse!}
        />
      </div>
    </div>
  );
};
