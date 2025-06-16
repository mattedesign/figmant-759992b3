
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useIsSmallMobile } from '@/hooks/use-mobile';
import { 
  Menu,
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

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOwner } = useAuth();
  const isSmallMobile = useIsSmallMobile();

  const mainSections = [
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

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size={isSmallMobile ? "default" : "sm"} 
          className={isSmallMobile ? "h-10 w-10 p-0" : "h-8 w-8 p-0"}
        >
          <Menu className={isSmallMobile ? "h-5 w-5" : "h-4 w-4"} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 safe-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 safe-top">
            <h1 className="text-2xl font-bold text-gray-900">figmant</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {mainSections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 text-base",
                    activeSection === section.id && "bg-[#F9FAFB] text-[#3D4A5C] rounded-[20px]",
                    section.id === 'admin' && activeSection !== section.id && "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
                    section.id === 'admin' && activeSection === section.id && "bg-[#F9FAFB] text-[#3D4A5C] rounded-[20px] border-none"
                  )}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <section.icon className={cn(
                    "h-5 w-5 mr-3",
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
