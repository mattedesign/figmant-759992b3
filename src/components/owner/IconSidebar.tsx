
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, CreditCard, Settings, Bot, Building2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface IconSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: BarChart3,
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
  },
  {
    id: 'products',
    label: 'Products',
    icon: CreditCard,
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: Bot,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const IconSidebar = ({ activeSection, onSectionChange }: IconSidebarProps) => {
  const { user, profile } = useAuth();

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Sidebar className="w-16 border-r">
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="flex flex-col space-y-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-lg transition-colors",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => onSectionChange(section.id)}
              title={section.label}
            >
              <section.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="flex items-center justify-center">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-xs bg-muted">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
