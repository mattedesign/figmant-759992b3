
import React, { useState } from 'react';
import { FigmantSidebar } from './FigmantSidebar';
import { FigmantMiddlePanel } from './FigmantMiddlePanel';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { useAuth } from '@/contexts/AuthContext';

export const FigmantLayout = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('design-analysis');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Navigation */}
      <div className="w-16 bg-card border-r border-border flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Middle Panel - Context/Analysis List */}
      <div className="w-80 bg-card border-r border-border flex-shrink-0">
        <FigmantMiddlePanel 
          activeSection={activeSection}
          onAnalysisSelect={setSelectedAnalysis}
          selectedAnalysis={selectedAnalysis}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <FigmantMainContent 
          activeSection={activeSection}
          selectedAnalysis={selectedAnalysis}
        />
      </div>

      {/* Right Sidebar - Attachments/Tools */}
      <div className="w-80 bg-card border-l border-border flex-shrink-0">
        <FigmantRightSidebar 
          activeSection={activeSection}
        />
      </div>
    </div>
  );
};
