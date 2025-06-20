
import React from 'react';
import { Button } from '@/components/ui/button';
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

  // Add admin section for owners - this should match desktop exactly
  if (isOwner) {
    mainSections.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {mainSections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 text-base",
              activeSection === section.id 
                ? "bg-gray-100 text-gray-900 rounded-[12px]"
                : section.id === 'admin' 
                  ? "border border-orange-200 bg-orange-50 text-orange-700 rounded-[12px] hover:bg-orange-100"
                  : "hover:bg-gray-50 hover:rounded-[12px]"
            )}
            onClick={() => onSectionChange(section.id)}
          >
            <section.icon className="mr-3 h-5 w-5" />
            {section.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
