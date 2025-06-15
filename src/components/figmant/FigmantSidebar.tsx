
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Image, 
  BarChart3, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { user, signOut } = useAuth();

  const navigationItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'design-analysis', icon: Image, label: 'Design Analysis' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* User Profile */}
      <div className="p-3 border-b border-border">
        <Avatar className="w-10 h-10 mx-auto">
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.id} className="px-2">
            <Button
              variant={activeSection === item.id ? "default" : "ghost"}
              size="icon"
              className="w-12 h-12"
              onClick={() => onSectionChange(item.id)}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-border space-y-2">
        <Button variant="ghost" size="icon" className="w-12 h-12" title="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12" 
          onClick={signOut}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
