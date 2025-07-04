
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';

interface IconSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

// Owner-specific sections with unified navigation for main items
const sections = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: BarChart3,
    activeColor: '#1812E9'
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    activeColor: '#20BF88'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    activeColor: '#E9408C'
  }
];

export const IconSidebar = ({
  activeSection,
  onSectionChange
}: IconSidebarProps) => {
  
  const getButtonStyle = (section: any, isActive: boolean) => {
    if (isActive) {
      return {
        borderRadius: '8px',
        backgroundColor: section.activeColor,
        boxShadow: '0px 2px 4px 1px rgba(18, 18, 18, 0.06)'
      };
    }
    return {};
  };

  const getHoverStyle = (section: any) => {
    return {
      '--hover-bg': `${section.activeColor}20`, // 20% opacity
    } as React.CSSProperties;
  };
  
  return (
    <div className="w-16 h-full border-r border-border flex flex-col overflow-hidden" style={{
      backgroundColor: '#F5F6FA'
    }}>
      {/* Navigation Icons */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="flex flex-col space-y-2">
          {sections.map(section => {
            const isActive = activeSection === section.id;
            return (
              <Button 
                key={section.id} 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "w-12 h-12 transition-colors flex-shrink-0 relative", 
                  isActive 
                    ? "text-white hover:text-white" 
                    : "hover:text-primary"
                )}
                style={{
                  ...getButtonStyle(section, isActive),
                  ...(!isActive ? getHoverStyle(section) : {})
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = `${section.activeColor}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '';
                  }
                }}
                onClick={() => onSectionChange(section.id)} 
                title={section.label}
              >
                <section.icon className="h-5 w-5" />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
