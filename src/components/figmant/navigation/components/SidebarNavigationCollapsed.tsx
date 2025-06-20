
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { navigationConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavigationCollapsedProps {
  onSectionChange: (section: string) => void;
  isOwner: boolean;
}

export const SidebarNavigationCollapsed: React.FC<SidebarNavigationCollapsedProps> = ({
  onSectionChange,
  isOwner
}) => {
  const mainItems = navigationConfig.mainItems;
  const supportItems = navigationConfig.supportItems;
  const adminItems = isOwner ? navigationConfig.adminItems : [];

  return (
    <div className="flex-1 flex flex-col py-4 overflow-hidden">
      {/* Main Navigation - Fixed layout, no scroll */}
      <div className="flex-none px-2 space-y-2">
        {mainItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSectionChange(item.id)}
                className="h-10 w-10 mx-auto"
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Support Items - Fixed layout, no scroll */}
      {supportItems.length > 0 && (
        <div className="flex-none px-2 mt-4 space-y-2">
          <div className="w-8 h-px bg-gray-200 mx-auto mb-2"></div>
          {supportItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSectionChange(item.id)}
                  className="h-10 w-10 mx-auto"
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Admin Items - Fixed layout, no scroll */}
      {adminItems.length > 0 && (
        <div className="flex-none px-2 mt-4 space-y-2">
          <div className="w-8 h-px bg-gray-200 mx-auto mb-2"></div>
          {adminItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSectionChange(item.id)}
                  className="h-10 w-10 mx-auto"
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};
