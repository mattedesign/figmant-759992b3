
import React, { useState } from 'react';
import { FigmantMainContent } from './FigmantMainContent';

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
    <FigmantMainContent
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      selectedAnalysis={selectedAnalysis}
      onBackToList={handleBackToList}
      onRightSidebarModeChange={handleRightSidebarModeChange}
    />
  );
};
