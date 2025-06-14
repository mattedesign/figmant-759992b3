
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  disabled?: boolean;
  badge?: string;
}

interface NavigationConfig {
  title: string;
  items: NavigationItem[];
}

interface NavigationSidebarProps {
  config: NavigationConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const NavigationSidebar = ({ 
  config, 
  activeTab, 
  onTabChange, 
  isCollapsed = false, 
  onToggleCollapse 
}: NavigationSidebarProps) => {
  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-64'} h-full bg-card border-r border-border flex flex-col overflow-hidden transition-all duration-300`}>
      {!isCollapsed && (
        <>
          {/* Header */}
          <div className="flex-none p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">{config.title}</h2>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-1">
              {config.items.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => !item.disabled && onTabChange(item.id)}
                  className={cn(
                    "w-full justify-start h-10 px-3 flex-shrink-0",
                    activeTab === item.id && "bg-accent text-accent-foreground",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={item.disabled}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {isCollapsed && onToggleCollapse && (
        <div className="h-full flex items-start pt-4 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
