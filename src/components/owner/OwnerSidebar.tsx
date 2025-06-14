
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { BarChart3, Users, CreditCard, Bot, Settings } from 'lucide-react';

interface OwnerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  {
    title: 'Design Analysis',
    value: 'design',
    icon: BarChart3,
  },
  {
    title: 'Users',
    value: 'users',
    icon: Users,
  },
  {
    title: 'Plans & Products',
    value: 'plans',
    icon: CreditCard,
  },
  {
    title: 'Claude AI',
    value: 'claude',
    icon: Bot,
  },
  {
    title: 'Settings',
    value: 'settings',
    icon: Settings,
  },
];

export const OwnerSidebar = ({ activeTab, onTabChange }: OwnerSidebarProps) => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Owner Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => onTabChange(item.value)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
