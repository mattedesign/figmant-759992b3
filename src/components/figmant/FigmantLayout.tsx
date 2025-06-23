
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FigmantSidebar } from './sidebar/FigmantSidebarContainer';
import { FigmantMainContent } from './FigmantMainContent';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { migrateNavigationRoute } from '@/utils/navigationMigration';

export const FigmantLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Extract section from pathname instead of search params
  const getActiveSectionFromPath = (pathname: string): string => {
    // Remove /figmant prefix and get the section
    const pathParts = pathname.split('/');
    if (pathParts.length >= 3) {
      return pathParts[2]; // e.g., /figmant/credits -> credits
    }
    return 'dashboard'; // default
  };
  
  const [activeSection, setActiveSection] = useState(() => {
    const pathSection = getActiveSectionFromPath(location.pathname);
    return migrateNavigationRoute(pathSection);
  });
  
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync activeSection with URL pathname changes
  useEffect(() => {
    const pathSection = getActiveSectionFromPath(location.pathname);
    const migratedSection = migrateNavigationRoute(pathSection);
    
    if (migratedSection !== activeSection) {
      console.log('🔧 URL sync - Updating section from path:', pathSection, '->', migratedSection);
      setActiveSection(migratedSection);
    }
  }, [location.pathname, activeSection]);

  // Handle navigation state from other pages
  useEffect(() => {
    if (location.state?.activeSection) {
      const migratedSection = migrateNavigationRoute(location.state.activeSection);
      console.log('🔧 Location state - Setting section:', migratedSection);
      setActiveSection(migratedSection);
      
      // Navigate to the clean URL path
      navigate(`/figmant/${migratedSection}`);
    }
  }, [location.state, navigate]);

  // Handle navigation by updating the URL path
  const handleSectionChange = (section: string) => {
    console.log('🔧 Section change requested:', section);
    const migratedSection = migrateNavigationRoute(section);
    
    setActiveSection(migratedSection);
    
    // Navigate to the clean URL path
    navigate(`/figmant/${migratedSection}`);
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
