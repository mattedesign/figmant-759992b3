
import React, { useState, useEffect } from 'react';
import { FigmantSidebar } from './FigmantSidebar';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [rightSidebarMode, setRightSidebarMode] = useState('attachments');
  const isMobile = useIsMobile();

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigateToAnalysis = () => {
      setActiveSection('analysis');
    };

    window.addEventListener('navigate-to-analysis', handleNavigateToAnalysis);
    
    return () => {
      window.removeEventListener('navigate-to-analysis', handleNavigateToAnalysis);
    };
  }, []);

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    setRightSidebarMode(mode);
  };

  return (
    <div className="h-screen flex bg-white">
      <FigmantSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <FigmantMainContent 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedAnalysis={selectedAnalysis}
          onBackToList={handleBackToList}
          onRightSidebarModeChange={handleRightSidebarModeChange}
        />
        {!isMobile && (
          <FigmantRightSidebar 
            mode={rightSidebarMode}
            activeSection={activeSection}
          />
        )}
      </div>
    </div>
  );
};
