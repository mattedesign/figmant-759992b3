
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
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed
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

  const adminItems = [
    { id: 'admin', label: 'Admin Panel', icon: Shield },
  ];

  const getMenuItemStyles = (isActive: boolean) => {
    return cn(
      "w-full justify-start text-left h-10 px-2 transition-all duration-200",
      isActive
        ? "bg-white text-[#3D4A5C] rounded-[12px] shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset]"
        : "text-[#455468] hover:bg-[#1812E9] hover:text-white hover:rounded-[12px]"
    );
  };

  const getIconStyles = (isActive: boolean) => {
    return cn(
      "h-4 w-4 mr-3 transition-all duration-200",
      isActive 
        ? "text-[#1812E9]" 
        : "text-[#455468] group-hover:text-white"
    );
  };

  const renderMenuItem = (item: any) => (
    <Button
      key={item.id}
      variant="ghost"
      className={getMenuItemStyles(activeSection === item.id)}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className={getIconStyles(activeSection === item.id)} />
      {!isCollapsed && (
        <span className="flex-1 text-left">
          {item.label}
        </span>
      )}
    </Button>
  );

  return (
    <div className="flex flex-col space-y-6 px-3">
      {/* Main Menu */}
      <div className="space-y-1">
        {mainMenuItems.map(renderMenuItem)}
      </div>

      {/* Support Section */}
      <div className="space-y-1 border-t border-gray-200/30 pt-4">
        {!isCollapsed && (
          <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">Support</h3>
        )}
        {supportItems.map(renderMenuItem)}
      </div>

      {/* Admin Section */}
      <div className="space-y-1 border-t border-gray-200/30 pt-4">
        {!isCollapsed && (
          <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">Admin</h3>
        )}
        {adminItems.map(renderMenuItem)}
      </div>
    </div>
  );
};
