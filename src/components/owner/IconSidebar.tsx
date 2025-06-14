
import { useState } from 'react';
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
    <div className="w-16 h-screen border-r border-border flex flex-col" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header with Icon Logo */}
      <div className="p-2 border-b border-border">
        <div className="w-12 h-12 flex items-center justify-center">
          <img 
            src="/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png" 
            alt="Figmant Icon" 
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex-1 px-2 py-4">
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
      </div>

      {/* Footer - User Avatar */}
      <div className="p-2 border-t border-border">
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
