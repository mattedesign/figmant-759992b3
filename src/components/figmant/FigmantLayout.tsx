// src/components/figmant/FigmantLayout.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FigmantSidebar } from './sidebar/FigmantSidebarContainer';
import { FigmantMainContent } from './FigmantMainContent';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { migrateNavigationRoute } from '@/utils/navigationMigration';

export const FigmantLayout: React.FC = () => {
  // Get section from URL parameters
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Responsive design states
  const isMobile = useIsMobile();
  const isTablet = !isMobile && window.innerWidth < 1024;
  
  // Default to dashboard if no section specified, apply migration for legacy URLs
  const rawActiveSection = section || 'dashboard';
  const activeSection = migrateNavigationRoute(rawActiveSection);
  
  // Handle navigation - update URL when section changes
  const handleSectionChange = (newSection: string) => {
    const migratedSection = migrateNavigationRoute(newSection);
    navigate(`/figmant/${migratedSection}`, { 
      state: location.state,
      replace: false 
    });
  };

  // Handle URL changes and migration redirects
  useEffect(() => {
    // If the current URL section needed migration, redirect to the correct URL
    if (section && section !== activeSection) {
      navigate(`/figmant/${activeSection}`, { 
        state: location.state,
        replace: true 
      });
    }
    
    // If no section in URL, redirect to dashboard
    if (!section) {
      navigate('/figmant/dashboard', { 
        state: location.state,
        replace: true 
      });
    }
  }, [section, activeSection, navigate, location.state]);

  // Handle navigation state from external links (like premium analysis, template selection)
  useEffect(() => {
    if (location.state?.activeSection) {
      const targetSection = migrateNavigationRoute(location.state.activeSection);
      if (targetSection !== activeSection) {
        navigate(`/figmant/${targetSection}`, { 
          state: location.state,
          replace: true 
        });
      }
    }
  }, [location.state, activeSection, navigate]);

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    // Handle right sidebar mode changes if needed
    console.log('Right sidebar mode changed:', mode);
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Screen size detection with responsive behavior
  const screenSize = React.useMemo(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    isMobile,
    isTablet
  }), [isMobile, isTablet]);

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

  // Desktop layout with responsive sidebar behavior
  return (
    <div className="h-screen flex w-full gap-4 overflow-hidden p-3" style={{ background: 'transparent' }}>
      <div className="flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onCollapsedChange={handleSidebarCollapsedChange}
        />
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
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