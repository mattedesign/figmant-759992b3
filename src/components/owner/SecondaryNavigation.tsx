
import { Button } from '@/components/ui/button';
import { BarChart3, Users, CreditCard, Bot, Settings, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SecondaryNavigationProps {
  activeSection: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sectionConfig = {
  workspace: {
    title: 'Workspace',
    items: [
      { id: 'design', label: 'Design Analysis', icon: BarChart3 },
    ]
  },
  users: {
    title: 'User Management',
    items: [
      { id: 'users', label: 'All Users', icon: Users },
    ]
  },
  products: {
    title: 'Products & Plans',
    items: [
      { id: 'plans', label: 'Subscription Plans', icon: CreditCard },
    ]
  },
  apps: {
    title: 'Applications',
    items: [
      { id: 'claude', label: 'Claude AI', icon: Bot },
    ]
  },
  settings: {
    title: 'Settings',
    items: [
      { id: 'settings', label: 'Admin Settings', icon: Settings },
      { 
        id: 'alerts', 
        label: 'Alerts', 
        icon: Bell, 
        disabled: true,
        badge: 'Soon'
      },
    ]
  },
};

export const SecondaryNavigation = ({ activeSection, activeTab, onTabChange }: SecondaryNavigationProps) => {
  const config = sectionConfig[activeSection as keyof typeof sectionConfig];

  if (!config) {
    return (
      <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <div className="flex-1 p-4">
          <div className="text-muted-foreground">
            Select a section from the left sidebar
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">{config.title}</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-2">
        <div className="space-y-1">
          {config.items.map((item) => (
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
    </div>
  );
};
