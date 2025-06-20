
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
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 h-full">
        {/* Main Menu Items - Collapsed */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          {mainMenuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              onClick={() => onSectionChange(item.id)}
              className="w-12 h-12 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
            >
              <item.icon 
                className="h-6 w-6"
                style={{ color: '#6B7280' }}
              />
            </Button>
          ))}
        </div>

        {/* Support Items - Collapsed */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          {supportItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              onClick={() => onSectionChange(item.id)}
              className="w-12 h-12 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
            >
              <item.icon 
                className="h-6 w-6"
                style={{ color: '#6B7280' }}
              />
            </Button>
          ))}
        </div>

        {/* Admin Items - Collapsed */}
        {adminItems.length > 0 && (
          <div className="flex flex-col items-center space-y-3">
            {adminItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                onClick={() => onSectionChange(item.id)}
                className="w-12 h-12 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
              >
                <item.icon 
                  className="h-6 w-6"
                  style={{ color: '#6B7280' }}
                />
              </Button>
            ))}
          </div>
        )}
      </div>
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
