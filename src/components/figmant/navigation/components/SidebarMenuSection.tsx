
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

interface SidebarMenuSectionProps {
  title?: string;
  items: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  title,
  items,
  activeSection,
  onSectionChange
}) => {
  return (
    <div className="space-y-1">
      {title && (
        <h3 
          className="text-xs font-medium px-3 mb-2 uppercase tracking-wide"
          style={{ color: '#6B7280' }}
        >
          {title}
        </h3>
      )}
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onSectionChange(item.id)}
          className={cn(
            "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none group",
            activeSection === item.id
              ? "text-blue-600 font-medium rounded-lg"
              : "text-gray-700 hover:bg-gray-50"
          )}
          style={
            activeSection === item.id 
              ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
              : {}
          }
        >
          <item.icon 
            className={cn(
              "h-5 w-5 mr-3",
              activeSection === item.id 
                ? "text-blue-600" 
                : "text-gray-500 group-hover:text-gray-700"
            )}
          />
          <span className="font-medium text-sm">
            {item.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
