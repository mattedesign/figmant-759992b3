
import React, { useState } from 'react';
import { FigmantSidebar } from './FigmantSidebar';
import { FigmantMainContent } from './FigmantMainContent';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const FigmantLayout = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [rightSidebarMode, setRightSidebarMode] = useState('attachments');

  console.log('FigmantLayout rendering...', { user, activeSection });

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-[#E9EFF6]">
        {/* Mobile Header */}
        <div className="flex-none bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <MobileNavigation 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="font-semibold">figmant</span>
            </div>
            <div className="w-8" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          <FigmantMainContent 
            activeSection={activeSection}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={setRightSidebarMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#E9EFF6]">
      {/* Desktop Sidebar */}
      <div className="flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-hidden">
          <FigmantMainContent 
            activeSection={activeSection}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={setRightSidebarMode}
          />
        </div>
      </div>
    </div>
  );
};
