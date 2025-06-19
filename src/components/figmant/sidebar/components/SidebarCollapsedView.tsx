
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarUserProfile } from '../SidebarUserProfile';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarCollapsedViewProps {
  mainMenuItems: MenuItem[];
  supportItems: MenuItem[];
  adminItems?: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleCollapse: (collapsed: boolean) => void;
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => Promise<void>;
}

export const SidebarCollapsedView: React.FC<SidebarCollapsedViewProps> = ({
  mainMenuItems,
  supportItems,
  adminItems = [],
  activeSection,
  onSectionChange,
  onToggleCollapse,
  isOwner,
  profile,
  user,
  subscription,
  signOut
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header with expand button */}
      <div className="p-4 border-b border-gray-200/30 flex justify-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onToggleCollapse(false)}
          className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile Section - Positioned at top like expanded state */}
      <div className="flex-shrink-0">
        <SidebarUserProfile 
          isOwner={isOwner}
          profile={profile}
          user={user}
          subscription={subscription}
          signOut={signOut}
          isCollapsed={true}
        />
      </div>

      {/* Navigation items - centered alignment */}
      <div className="flex-1 overflow-y-auto py-6">
        {/* Main Menu Items */}
        <div className="px-2 space-y-2 flex flex-col items-center">
          {mainMenuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 p-0",
                activeSection === item.id 
                  ? "bg-white text-[#3D4A5C]" 
                  : "hover:bg-white hover:text-[#3D4A5C]"
              )}
              onClick={() => onSectionChange(item.id)}
              title={item.label}
            >
              <item.icon className={cn(
                "h-4 w-4",
                activeSection === item.id 
                  ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                  : "text-[#455468]"
              )} />
            </Button>
          ))}
        </div>

        {/* Support Items */}
        {supportItems.length > 0 && (
          <>
            <div className="my-4 border-t border-gray-200/30"></div>
            <div className="px-2 space-y-2 flex flex-col items-center">
              {supportItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 p-0",
                    activeSection === item.id 
                      ? "bg-white text-[#3D4A5C]" 
                      : "hover:bg-white hover:text-[#3D4A5C]"
                  )}
                  onClick={() => onSectionChange(item.id)}
                  title={item.label}
                >
                  <item.icon className={cn(
                    "h-4 w-4",
                    activeSection === item.id 
                      ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                      : "text-[#455468]"
                  )} />
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Admin Items - Only show for owners */}
        {isOwner && adminItems.length > 0 && (
          <>
            <div className="my-4 border-t border-gray-200/30"></div>
            <div className="px-2 space-y-2 flex flex-col items-center">
              {adminItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 p-0",
                    activeSection === item.id 
                      ? "bg-white text-[#3D4A5C]" 
                      : "hover:bg-white hover:text-[#3D4A5C]"
                  )}
                  onClick={() => onSectionChange(item.id)}
                  title={item.label}
                >
                  <item.icon className={cn(
                    "h-4 w-4",
                    activeSection === item.id 
                      ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                      : "text-[#455468]"
                  )} />
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
