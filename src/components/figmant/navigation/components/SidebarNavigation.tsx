
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
  isOwner?: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
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

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4" style={{ backgroundColor: '#F8F9FA' }}>
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

  return (
    <div className="flex flex-col space-y-6 px-4 py-4" style={{ backgroundColor: 'white' }}>
      {/* Main Menu - Expanded */}
      <div className="space-y-1">
        {mainMenuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none",
              activeSection === item.id
                ? "rounded-lg text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
            style={
              activeSection === item.id 
                ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
                : {}
            }
          >
            <item.icon 
              className="h-5 w-5 mr-3" 
              style={{ 
                color: activeSection === item.id ? '#2563EB' : '#374151'
              }}
            />
            <span className="font-medium text-sm">
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Support Section - Expanded */}
      <div className="space-y-1">
        <h3 
          className="text-xs font-medium px-3 mb-2 uppercase tracking-wide"
          style={{ color: '#6B7280' }}
        >
          Support
        </h3>
        {supportItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none",
              activeSection === item.id
                ? "rounded-lg text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
            style={
              activeSection === item.id 
                ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
                : {}
            }
          >
            <item.icon 
              className="h-5 w-5 mr-3" 
              style={{ 
                color: activeSection === item.id ? '#2563EB' : '#374151'
              }}
            />
            <span className="font-medium text-sm">
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Admin Section - Expanded */}
      {adminItems.length > 0 && (
        <div className="space-y-1">
          <h3 
            className="text-xs font-medium px-3 mb-2 uppercase tracking-wide"
            style={{ color: '#6B7280' }}
          >
            Admin
          </h3>
          {adminItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none",
                activeSection === item.id
                  ? "rounded-lg text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
              style={
                activeSection === item.id 
                  ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
                  : {}
              }
            >
              <item.icon 
                className="h-5 w-5 mr-3" 
                style={{ 
                  color: activeSection === item.id ? '#2563EB' : '#374151'
                }}
              />
              <span className="font-medium text-sm">
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
