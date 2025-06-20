
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wand2, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Shield
} from 'lucide-react';

interface SidebarNavigationCollapsedProps {
  onSectionChange: (section: string) => void;
  isOwner?: boolean;
}

export const SidebarNavigationCollapsed: React.FC<SidebarNavigationCollapsedProps> = ({
  onSectionChange,
  isOwner = false
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

  const allItems = [...mainMenuItems, ...supportItems, ...adminItems];

  return (
    <div className="flex flex-col items-center py-4 space-y-3" style={{ backgroundColor: '#F8F9FA' }}>
      {allItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="icon"
          onClick={() => onSectionChange(item.id)}
          className="w-10 h-10 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
        >
          <item.icon 
            className="h-5 w-5"
            style={{ color: '#6B7280' }}
          />
        </Button>
      ))}
    </div>
  );
};
