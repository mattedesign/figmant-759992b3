
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { BarChart3, Users, CreditCard, Bot, Settings, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      <Sidebar className="w-64 border-r">
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-muted-foreground">
            Select a section from the left sidebar
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">{config.title}</h2>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => !item.disabled && onTabChange(item.id)}
                    className={`w-full justify-start ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={item.disabled}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
