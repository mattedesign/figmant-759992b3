
import React from 'react';
import { SidebarMenuSection } from './components/SidebarMenuSection';
import { SidebarCollapseToggle } from './components/SidebarCollapseToggle';
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

  const allSections = [
    ...mainMenuSections,
    supportSection,
    ...adminSections
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <SidebarMenuSection 
          sections={allSections}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>
      
      {/* Only show the collapse toggle at the bottom when collapsed */}
      {isCollapsed && (
        <SidebarCollapseToggle 
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}
    </div>
  );
};
