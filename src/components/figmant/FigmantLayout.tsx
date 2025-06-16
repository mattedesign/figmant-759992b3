
import React, { useState } from 'react';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantSidebar } from './FigmantSidebar';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    // Handle right sidebar mode changes if needed
    console.log('Right sidebar mode changed to:', mode);
  };

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
