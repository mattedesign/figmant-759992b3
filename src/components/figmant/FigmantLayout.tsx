
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { FigmantSidebar } from './sidebar/FigmantSidebarContainer';
import { FigmantMainContent } from './FigmantMainContent';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { migrateNavigationRoute } from '@/utils/navigationMigration';

export const FigmantLayout: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Extract section from URL path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const urlSection = pathSegments.length > 1 ? pathSegments[1] : 'dashboard';
  
  // Apply migration and set active section
  const [activeSection, setActiveSection] = useState(() => {
    const migratedSection = migrateNavigationRoute(urlSection);
    return migratedSection;
  });
  
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Update section when URL changes
  useEffect(() => {
    const newSection = pathSegments.length > 1 ? pathSegments[1] : 'dashboard';
    const migratedSection = migrateNavigationRoute(newSection);
    
    if (migratedSection !== activeSection) {
      setActiveSection(migratedSection);
    }
  }, [location.pathname, activeSection, pathSegments]);

  // Handle section changes from sidebar
  const handleSectionChange = (newSection: string) => {
    const migratedSection = migrateNavigationRoute(newSection);
    setActiveSection(migratedSection);
    
    // Update URL without full navigation
    window.history.pushState({}, '', `/figmant/${migratedSection}`);
  };

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    console.log('Right sidebar mode changed:', mode);
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col w-full overflow-hidden p-3" style={{ background: 'transparent' }}>
        {/* Mobile Header with Navigation */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-lg">
          <h1 className="text-xl font-bold text-gray-900">figmant</h1>
          <MobileNavigation 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>
        
        {/* Mobile Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <FigmantMainContent
            activeSection={activeSection}
            setActiveSection={handleSectionChange}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={handleRightSidebarModeChange}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen flex w-full gap-4 overflow-hidden p-3" style={{ background: 'transparent' }}>
      {/* Sidebar */}
      <div className="flex-shrink-0 relative z-10">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onCollapsedChange={handleSidebarCollapsedChange}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-hidden relative z-0">
        <FigmantMainContent
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          selectedAnalysis={selectedAnalysis}
          onBackToList={handleBackToList}
          onRightSidebarModeChange={handleRightSidebarModeChange}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </div>
  );
};
