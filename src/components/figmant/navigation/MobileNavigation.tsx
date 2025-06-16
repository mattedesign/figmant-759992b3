
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu,
  LayoutDashboard,
  FileText,
  Star,
  CreditCard,
  FileSearch,
  Settings,
  Search,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: FileText,
    badge: 'New'
  },
  {
    id: 'premium-analysis',
    label: 'Premium Analysis',
    icon: Star,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: FileSearch,
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
  },
  {
    id: 'credits',
    label: 'Credits',
    icon: CreditCard,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Settings,
  },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Figmant
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleSectionChange(item.id)}
                className={cn(
                  "w-full justify-start h-12",
                  isActive && "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
