import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const renderMenuItem = (item: MenuItem) => (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        "w-full justify-start text-left h-10 px-2",
        activeSection === item.id
          ? "bg-white text-[#3D4A5C] rounded-[12px] shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset]"
          : "hover:bg-white hover:text-[#3D4A5C] hover:rounded-[12px] hover:shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset]"
      )}
      style={{
        display: 'flex',
        height: '40px',
        padding: '4px 8px 4px 4px',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: '12px',
        background: activeSection === item.id 
          ? 'rgba(10, 169, 255, 0.16)' 
          : 'var(--Surface-01, #FCFCFC)'
      }}
      onMouseEnter={e => {
        if (activeSection !== item.id) {
          e.currentTarget.style.background = 'var(--Surface-03, #F1F1F1)';
        }
      }}
      onMouseLeave={e => {
        if (activeSection !== item.id) {
          e.currentTarget.style.background = 'var(--Surface-01, #FCFCFC)';
        }
      }}
      onClick={() => onSectionChange(item.id)}
    >
      <div className={cn(
        "w-8 h-8 mr-1 rounded-[8px] flex items-center justify-center",
        activeSection === item.id ? "bg-white" : "bg-[var(--Surface-03,#F1F1F1)]"
      )}>
        <item.icon className={cn(
          "h-4 w-4",
          activeSection === item.id ? "text-[#1812E9] fill-current" : "text-[#455468]"
        )} />
      </div>
      <span
        className={cn(
          "flex-1 text-left",
          activeSection === item.id ? "text-[#1812E9] font-medium" : "text-[#455468] font-medium"
        )}
        style={activeSection === item.id ? {
          overflow: 'hidden',
          color: '#1812E9',
          textOverflow: 'ellipsis',
          fontFamily: '"Instrument Sans"',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'auto',
          letterSpacing: '-0.12px',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        } : {
          overflow: 'hidden',
          color: 'var(--Text-Primary, #121212)',
          textOverflow: 'ellipsis',
          fontFamily: '"Instrument Sans"',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '20px',
          letterSpacing: '-0.12px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}
      >
        {item.label}
      </span>
    </Button>
  );

  const renderMenuSection = (section: MenuSection, sectionKey: string, isFirst: boolean) => {
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
                onClick={() => toggleSection(section.title!)}
                className="h-6 w-6 p-0"
              >
                {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
            )}
          </div>
        )}
        
        {(!section.title || !isCollapsed) && (
          <div style={{
            display: 'flex',
            padding: '12px',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            alignSelf: 'stretch',
            ...(isFirst ? {} : { borderTop: '1px solid var(--Stroke-01, #ECECEC)' })
          }}>
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
    <div className="space-y-6 mb-4 px-[8px]">
      {sections.map((section, index) => renderMenuSection(section, `section-${index}`, index === 0))}
    </div>
  );
};
