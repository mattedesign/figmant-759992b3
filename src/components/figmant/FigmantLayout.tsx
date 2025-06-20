
import React, { useState } from 'react';
import { FigmantSidebar } from '@/components/figmant/sidebar/FigmantSidebarContainer';
import { FigmantMainContent } from './FigmantMainContent';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('design');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSectionChange = (section: string) => {
    console.log('🎯 FIGMANT LAYOUT - Section change:', section);
    setActiveSection(section);
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <FigmantSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onCollapsedChange={handleSidebarCollapseChange}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <FigmantMainContent 
          activeSection={activeSection}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </div>
  );
};
