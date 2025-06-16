
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

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner
}) => {
  const mainSections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Star },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'search', label: 'Search', icon: Search },
  ];

  // Add admin section for owners
  if (isOwner) {
    mainSections.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Pages Section */}
      <div>
        <div className="text-sm font-medium text-gray-500 mb-3">Pages</div>
        <div className="space-y-1">
          {mainSections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                activeSection === section.id && "bg-[#F9FAFB] text-[#3D4A5C] rounded-[20px]",
                section.id === 'admin' && activeSection !== section.id && "border border-orange-200 bg-orange-50/80 text-orange-700 hover:bg-orange-100/80",
                section.id === 'admin' && activeSection === section.id && "bg-[#F9FAFB] text-[#3D4A5C] rounded-[20px] border-none"
              )}
              onClick={() => onSectionChange(section.id)}
            >
              <section.icon className={cn(
                "h-4 w-4 mr-3",
                activeSection === section.id && "text-[#3D4A5C]"
              )} />
              <span className={cn(
                activeSection === section.id && "text-[#3D4A5C]"
              )}>
                {section.label}
              </span>
              {section.id === 'admin' && (
                <Badge variant="secondary" className={cn(
                  "ml-auto",
                  activeSection === section.id ? "bg-[#3D4A5C]/10 text-[#3D4A5C]" : "bg-orange-100 text-orange-700"
                )}>
                  Owner
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
