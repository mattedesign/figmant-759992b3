
import React, { useState } from 'react';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantSidebar } from './FigmantSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    console.log('Right sidebar mode changed to:', mode);
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col w-full" style={{ background: 'transparent' }}>
        {/* Mobile Header with Navigation */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">figmant</h1>
          <MobileNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
        
        {/* Mobile Main Content */}
        <div className="flex-1 overflow-hidden">
          <FigmantMainContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={handleRightSidebarModeChange}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
    );
  }

  // Desktop layout with fixed sidebar and scrollable main content
  return (
    <div className="min-h-screen h-screen flex w-full gap-4 overflow-hidden" style={{ background: 'transparent' }}>
      <div className="flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCollapsedChange={handleSidebarCollapsedChange}
        />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <FigmantMainContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedAnalysis={selectedAnalysis}
          onBackToList={handleBackToList}
          onRightSidebarModeChange={handleRightSidebarModeChange}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </div>
  );
};
