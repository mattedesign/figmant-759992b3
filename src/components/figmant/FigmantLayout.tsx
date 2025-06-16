
import React, { useState } from 'react';
import { FigmantSidebar } from './FigmantSidebar';
import { FigmantMiddlePanel } from './FigmantMiddlePanel';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { FigmantBreadcrumbs } from './navigation/FigmantBreadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { useMobile } from '@/hooks/use-mobile';

const getSectionBreadcrumbs = (activeSection: string, selectedAnalysis: any) => {
  const breadcrumbs = [];
  
  switch (activeSection) {
    case 'dashboard':
      breadcrumbs.push({ label: 'Dashboard', isActive: true });
      break;
    case 'analysis':
      breadcrumbs.push({ label: 'Analysis', href: '#', isActive: !selectedAnalysis });
      if (selectedAnalysis) {
        breadcrumbs.push({ label: 'Analysis Details', isActive: true });
      }
      break;
    case 'premium-analysis':
      breadcrumbs.push({ label: 'Premium Analysis', isActive: true });
      break;
    case 'templates':
      breadcrumbs.push({ label: 'Templates', isActive: true });
      break;
    case 'search':
      breadcrumbs.push({ label: 'Search', isActive: true });
      break;
    case 'credits':
      breadcrumbs.push({ label: 'Credits', isActive: true });
      break;
    case 'preferences':
      breadcrumbs.push({ label: 'Preferences', isActive: true });
      break;
    default:
      break;
  }
  
  return breadcrumbs;
};

export const FigmantLayout = () => {
  const { user } = useAuth();
  const isMobile = useMobile();
  const [activeSection, setActiveSection] = useState('analysis');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [rightSidebarMode, setRightSidebarMode] = useState('attachments');

  console.log('FigmantLayout rendering...', { user, activeSection });

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleAnalysisSelect = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const breadcrumbs = getSectionBreadcrumbs(activeSection, selectedAnalysis);

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
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
              <span className="font-semibold">Figmant</span>
            </div>
            <div className="w-8" /> {/* Spacer for alignment */}
          </div>
          
          {breadcrumbs.length > 0 && (
            <div className="mt-3">
              <FigmantBreadcrumbs items={breadcrumbs} />
            </div>
          )}
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
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Middle Panel - Analysis List */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
        <FigmantMiddlePanel 
          activeSection={activeSection}
          onAnalysisSelect={handleAnalysisSelect}
          selectedAnalysis={selectedAnalysis}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex-none p-4 border-b border-gray-200">
            <FigmantBreadcrumbs items={breadcrumbs} />
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <FigmantMainContent 
            activeSection={activeSection}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={setRightSidebarMode}
          />
        </div>
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
