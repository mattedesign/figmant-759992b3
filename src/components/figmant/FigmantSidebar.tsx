
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

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { isOwner } = useAuth();

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
    <div className="w-64 bg-transparent border-r border-gray-200/30 flex flex-col h-full backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/30">
        <h1 className="text-xl font-bold text-gray-900">figmant</h1>
      </div>

      {/* Navigation */}
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/30 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Star className="h-4 w-4 mr-3" />
          Premium
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-3" />
          Credits
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <div className="w-4 h-4 mr-3 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs">?</span>
          </div>
          Help
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50/50 rounded-lg cursor-pointer">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">R</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">Ronald Richards</div>
            <div className="text-xs text-gray-500 truncate">ronaldrichards@gmail.com</div>
          </div>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <div className="w-4 h-4 text-gray-400">↓</div>
          </Button>
        </div>
      </div>
    </div>
  );
};
