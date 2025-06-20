
import React, { useState } from 'react';
import { SidebarMenuGroup } from './SidebarMenuGroup';

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

  if (!sections || !Array.isArray(sections)) {
    console.error('SidebarMenuSection: sections prop is required and must be an array');
    return null;
  }

  return (
    <div className="space-y-6 mb-4 px-[8px]">
      {sections.map((section, index) => (
        <SidebarMenuGroup
          key={`section-${index}`}
          section={section}
          sectionKey={`section-${index}`}
          isFirst={index === 0}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          collapsedSections={collapsedSections}
          onToggleSection={toggleSection}
        />
      ))}
    </div>
  );
};
