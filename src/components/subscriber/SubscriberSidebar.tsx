
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SubscriberSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SubscriberSidebar = ({ activeTab, onTabChange }: SubscriberSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, profile } = useAuth();

  // Use unified navigation configuration
  const visibleItems = navigationConfig.mainItems.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    badge: item.id === 'competitor-analysis' ? 'New' : undefined,
    disabled: false
  }));

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const onToggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="w-20 h-full bg-card border-r border-border flex flex-col overflow-hidden transition-all duration-300 p-2 space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex-1 space-y-1">
            {visibleItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => !item.disabled && onTabChange(item.id)}
                    className={cn(
                      "w-full h-12",
                      activeTab === item.id && "bg-accent text-accent-foreground"
                    )}
                    disabled={item.disabled}
                    title={item.label}
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
          <div className="flex-none pt-2 border-t border-border">
            <div className="flex items-center justify-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col overflow-hidden transition-all duration-300">
      <div className="flex-none p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {visibleItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => !item.disabled && onTabChange(item.id)}
              className={cn(
                "w-full justify-start h-10 px-3",
                activeTab === item.id && "bg-accent text-accent-foreground",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={item.disabled}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-none p-2 border-t border-border">
        <div className="flex items-center justify-center">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-xs bg-muted">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
