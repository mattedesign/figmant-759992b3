
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SidebarMenuItem } from './SidebarMenuItem';
import { getMenuSectionContainerStyles } from './sidebarMenuStyles';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
}

interface SidebarMenuGroupProps {
  section: MenuSection;
  sectionKey: string;
  isFirst: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsedSections: Record<string, boolean>;
  onToggleSection: (sectionTitle: string) => void;
}

export const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({
  section,
  sectionKey,
  isFirst,
  activeSection,
  onSectionChange,
  collapsedSections,
  onToggleSection
}) => {
  const isCollapsed = section.title ? collapsedSections[section.title] : false;

  return (
    <div key={sectionKey} className="space-y-2">
      {section.title && (
        <div className="flex items-center justify-between px-[8px]">
          <h3 className="text-sm font-medium text-gray-500">{section.title}</h3>
          {section.collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleSection(section.title!)}
              className="h-6 w-6 p-0"
            >
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </Button>
          )}
        </div>
      )}
      
      {(!section.title || !isCollapsed) && (
        <div 
          style={getMenuSectionContainerStyles(isFirst)}
          className="hover:bg-[#1812E9] hover:rounded-[12px] transition-all"
        >
          {section.items?.map(item => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onSectionChange={onSectionChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
