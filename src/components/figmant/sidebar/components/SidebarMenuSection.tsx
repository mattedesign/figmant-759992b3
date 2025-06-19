
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
}

interface SidebarMenuSectionProps {
  sections: MenuSection[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  sections = [],
  activeSection,
  onSectionChange
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const renderMenuItem = (item: MenuItem) => (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        "w-full justify-start h-12 text-left",
        activeSection === item.id 
          ? "bg-white text-[#3D4A5C] rounded-[20px]"
          : "hover:bg-white hover:text-[#3D4A5C] hover:rounded-[20px]"
      )}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className={cn(
        "h-5 w-5 mr-3",
        activeSection === item.id ? "text-[#3D4A5C]" : "text-[#455468]"
      )} />
      <span className={cn(
        activeSection === item.id ? "text-[#3D4A5C] font-semibold" : "text-[#455468] font-medium"
      )}>
        {item.label}
      </span>
    </Button>
  );

  const renderMenuSection = (section: MenuSection, sectionKey: string) => {
    const isCollapsed = section.title ? collapsedSections[section.title] : false;
    
    return (
      <div key={sectionKey} className="space-y-2">
        {section.title && (
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{section.title}</h3>
            {section.collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection(section.title!)}
                className="h-6 w-6 p-0"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        )}
        
        {(!section.title || !isCollapsed) && (
          <div className="space-y-1">
            {section.items?.map(renderMenuItem)}
          </div>
        )}
      </div>
    );
  };

  if (!sections || !Array.isArray(sections)) {
    console.error('SidebarMenuSection: sections prop is required and must be an array');
    return null;
  }

  return (
    <div className="space-y-6 px-4 mb-4">
      {sections.map((section, index) => 
        renderMenuSection(section, `section-${index}`)
      )}
    </div>
  );
};
