
import React, { useState, useEffect } from 'react';
import { FigmantSidebar } from './FigmantSidebar';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
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

  return (
    <div className="h-screen flex bg-white">
      <FigmantSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <FigmantMainContent activeSection={activeSection} />
        {!isMobile && <FigmantRightSidebar />}
      </div>
    </div>
  );
};
