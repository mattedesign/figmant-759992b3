
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  PanelLeft, 
  PanelLeftClose,
  LayoutDashboard,
  FileText,
  Star,
  CreditCard,
  FileSearch,
  Settings,
  Search,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  disabled?: boolean;
}

interface CollapsibleSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: FileText,
    badge: 'New'
  },
  {
    id: 'premium-analysis',
    label: 'Premium Analysis',
    icon: Star,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: FileSearch,
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
  },
  {
    id: 'credits',
    label: 'Credits',
    icon: CreditCard,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Settings,
  },
];

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <TooltipProvider>
      <div className={cn(
        "h-full flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{
        borderRadius: '20px',
        border: '1px solid var(--Stroke-01, #ECECEC)',
        background: 'var(--Surface-01, #FCFCFC)'
      }}>
        {/* Header */}
        <div className="flex-none p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">Figmant</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            
            const buttonContent = (
              <Button
                key={item.id}
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
                <Tooltip key={item.id}>
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
          })}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="flex-none p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Figmant v2.0
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
