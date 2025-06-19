
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SidebarItem as SidebarItemType } from './sidebarConfig';

interface SidebarItemProps {
  item: SidebarItemType;
  isActive: boolean;
  isCollapsed: boolean;
  onSectionChange: (section: string) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onSectionChange
}) => {
  const buttonContent = (
    <Button
      variant="ghost"
      onClick={() => !item.disabled && onSectionChange(item.id)}
      className={cn(
        "w-full justify-start h-10",
        isActive && "bg-blue-50 text-blue-700 border border-blue-200",
        item.disabled && "opacity-50 cursor-not-allowed",
        isCollapsed && "px-2"
      )}
      style={
        isActive 
          ? {
              borderRadius: '12px',
              background: 'var(--Surface-03, #F1F1F1)'
            }
          : {}
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderRadius = '12px';
          e.currentTarget.style.background = 'var(--Surface-03, #F1F1F1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderRadius = '';
          e.currentTarget.style.background = '';
        }
      }}
      disabled={item.disabled}
    >
      <item.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-1")} />
      {!isCollapsed && (
        <>
          <span 
            className="flex-1 text-left"
            style={{
              overflow: 'hidden',
              color: 'var(--Text-Primary, #121212)',
              textOverflow: 'ellipsis',
              fontFamily: '"Instrument Sans"',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '16px',
              letterSpacing: '-0.12px'
            }}
          >
            {item.label}
          </span>
          {item.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex items-center gap-2">
            {item.label}
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
};
