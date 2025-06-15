
import React, { useState } from 'react';
import { FigmantSidebar } from './FigmantSidebar';
import { FigmantMiddlePanel } from './FigmantMiddlePanel';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { useAuth } from '@/contexts/AuthContext';

export const FigmantLayout = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('analysis');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [rightSidebarMode, setRightSidebarMode] = useState('attachments');

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Middle Panel - Analysis List */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
        <FigmantMiddlePanel 
          activeSection={activeSection}
          onAnalysisSelect={setSelectedAnalysis}
          selectedAnalysis={selectedAnalysis}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <FigmantMainContent 
          activeSection={activeSection}
          selectedAnalysis={selectedAnalysis}
          onBackToList={handleBackToList}
          onRightSidebarModeChange={setRightSidebarMode}
        />
      </div>

      {/* Right Sidebar - Attachments/Preview */}
      <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
        <FigmantRightSidebar 
          mode={rightSidebarMode}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
};
