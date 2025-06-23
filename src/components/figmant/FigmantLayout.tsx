
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
  
  // Get section from URL, default to 'dashboard'
  const sectionFromUrl = searchParams.get('section') || 'dashboard';
  const [activeSection, setActiveSection] = useState(() => migrateNavigationRoute(sectionFromUrl));
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync activeSection with URL parameters
  useEffect(() => {
    const currentSection = searchParams.get('section') || 'dashboard';
    const migratedSection = migrateNavigationRoute(currentSection);
    
    if (migratedSection !== activeSection) {
      console.log('🔧 URL sync - Updating section:', currentSection, '->', migratedSection);
      setActiveSection(migratedSection);
    }
  }, [searchParams, activeSection]);

  // Handle navigation state from other pages
  useEffect(() => {
    if (location.state?.activeSection) {
      const migratedSection = migrateNavigationRoute(location.state.activeSection);
      console.log('🔧 Location state - Setting section:', migratedSection);
      setActiveSection(migratedSection);
      
      // Update URL to match
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('section', migratedSection);
        return newParams;
      });
    }
  }, [location.state, setSearchParams]);

  // Update setActiveSection to also update URL
  const handleSectionChange = (section: string) => {
    console.log('🔧 Section change requested:', section);
    const migratedSection = migrateNavigationRoute(section);
    
    setActiveSection(migratedSection);
    
    // Update URL
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('section', migratedSection);
      return newParams;
    });
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
