
import React, { useState } from 'react';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantSidebar } from './FigmantSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const isMobile = useIsMobile();

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    console.log('Right sidebar mode changed to:', mode);
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
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full" style={{ background: 'transparent' }}>
      <FigmantSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <FigmantMainContent
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedAnalysis={selectedAnalysis}
        onBackToList={handleBackToList}
        onRightSidebarModeChange={handleRightSidebarModeChange}
      />
    </div>
  );
};
