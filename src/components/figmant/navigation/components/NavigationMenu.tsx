
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  BarChart3, 
  Star, 
  FileText, 
  Settings,
  Search,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { isOwner } = useAuth();

  const mainSections: NavigationSection[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Star },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  // Add admin section for owners
  if (isOwner) {
    mainSections.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {mainSections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 text-base",
              activeSection === section.id 
                ? "rounded-[12px] text-[#3D4A5C]"
                : section.id === 'admin' 
                  ? "border border-orange-200 bg-orange-50 text-orange-700 rounded-[12px] hover:text-[#3D4A5C]"
                  : "hover:text-[#3D4A5C] hover:rounded-[12px]"
            )}
            style={
              activeSection === section.id 
                ? {
                    borderRadius: '12px',
                    background: 'var(--Surface-03, #F1F1F1)'
                  }
                : {}
            }
            onMouseEnter={(e) => {
              if (activeSection !== section.id && section.id !== 'admin') {
                e.currentTarget.style.borderRadius = '12px';
                e.currentTarget.style.background = 'var(--Surface-03, #F1F1F1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.id && section.id !== 'admin') {
                e.currentTarget.style.borderRadius = '';
                e.currentTarget.style.background = '';
              }
            }}
            onClick={() => onSectionChange(section.id)}
          >
            <section.icon className={cn(
              "h-5 w-5 mr-1",
              activeSection === section.id && "text-[#3D4A5C]"
            )} />
            <span className={cn(
              "flex-1 text-left",
              activeSection === section.id && "text-[#3D4A5C]"
            )}>
              {section.label}
            </span>
            {section.id === 'admin' && (
              <Badge variant="secondary" className={cn(
                "ml-auto text-xs",
                activeSection === section.id ? "bg-[#3D4A5C]/10 text-[#3D4A5C]" : "bg-orange-100 text-orange-700"
              )}>
                Owner
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
