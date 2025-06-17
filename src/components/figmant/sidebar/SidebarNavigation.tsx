
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  BarChart3, 
  Crown, 
  FileText, 
  Settings,
  Search,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const mainSections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Crown },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const handleToggle = () => {
    onToggleCollapse?.(!isCollapsed);
  };

  if (isCollapsed) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col py-6">
        <div className="p-2 space-y-2 flex-1">
          {mainSections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 p-0",
                activeSection === section.id 
                  ? "bg-white text-[#3D4A5C]" 
                  : "hover:bg-white hover:text-[#3D4A5C]"
              )}
              onClick={() => onSectionChange(section.id)}
              title={section.label}
            >
              <section.icon className={cn(
                "h-4 w-4",
                activeSection === section.id 
                  ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                  : "text-[#455468]"
              )} />
            </Button>
          ))}
        </div>
        
        {/* Toggle button at bottom */}
        <div className="p-2 border-t border-gray-200/30 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggle}
            className="w-10 h-10 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
          >
            <PanelLeftOpen className="h-9 w-9" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col py-6">
      {/* Pages Section */}
      <div className="p-4 space-y-6 flex-1">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-3">Pages</div>
          <div className="space-y-1">
            {mainSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeSection === section.id 
                    ? "bg-white text-[#3D4A5C] rounded-[20px]"
                    : "hover:bg-white hover:text-[#3D4A5C] hover:rounded-[20px]"
                )}
                onClick={() => onSectionChange(section.id)}
              >
                <section.icon className={cn(
                  "h-4 w-4 mr-3",
                  activeSection === section.id 
                    ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                    : "text-[#455468]"
                )} />
                <span className={cn(
                  activeSection === section.id 
                    ? "text-[#3D4A5C] font-semibold" 
                    : "text-[#455468] font-medium"
                )}>
                  {section.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle button at bottom */}
      <div className="p-4 border-t border-gray-200/30">
        <Button 
          variant="ghost"
          onClick={handleToggle}
          className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
        >
          <PanelLeftClose className="h-4 w-4 mr-3" />
          <span className="text-sm font-medium">Collapse</span>
        </Button>
      </div>
    </div>
  );
};
