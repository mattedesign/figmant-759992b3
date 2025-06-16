
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Home,
  BarChart3, 
  Star, 
  FileText, 
  Settings,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
  isCollapsed?: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner,
  isCollapsed = false
}) => {
  const mainSections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Star },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const renderButton = (section: any) => {
    const isActive = activeSection === section.id;
    
    return (
      <Button
        key={section.id}
        variant="ghost"
        className={cn(
          "w-full justify-start h-11",
          isActive && "bg-blue-50 text-blue-700 border border-blue-200 rounded-xl",
          isCollapsed && "px-2 justify-center"
        )}
        onClick={() => onSectionChange(section.id)}
      >
        <section.icon className={cn(
          "h-5 w-5",
          isActive && "text-blue-700",
          !isCollapsed && "mr-3"
        )} />
        {!isCollapsed && (
          <span className={cn(
            "flex-1 text-left font-medium",
            isActive && "text-blue-700"
          )}>
            {section.label}
          </span>
        )}
      </Button>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Pages Section */}
        <div>
          {!isCollapsed && (
            <div className="text-sm font-semibold text-gray-500 mb-4 px-2">Pages</div>
          )}
          <div className="space-y-2">
            {mainSections.map((section) => {
              if (isCollapsed) {
                return (
                  <Tooltip key={section.id}>
                    <TooltipTrigger asChild>
                      {renderButton(section)}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-900 text-white">
                      {section.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return renderButton(section);
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
