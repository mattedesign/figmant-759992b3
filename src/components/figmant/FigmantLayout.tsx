
import React, { useState, useEffect } from 'react';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantSidebar } from './FigmantSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Auto-collapse sidebar for tablet screens (768px - 1023px)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      console.log('🔧 FIGMANT LAYOUT - Resize detected:', { width, isTablet });
      
      // Only auto-collapse for tablet range (768px - 1023px)
      // Mobile (< 768px) and Desktop (>= 1024px) maintain their own behavior
      if (width >= 768 && width < 1024) {
        console.log('🔧 FIGMANT LAYOUT - Setting collapsed for tablet');
        setIsSidebarCollapsed(true);
      } else if (width >= 1024) {
        console.log('🔧 FIGMANT LAYOUT - Setting expanded for desktop');
        // Auto-expand for desktop unless user manually collapsed it
        // We'll track manual collapse state separately if needed
        setIsSidebarCollapsed(false);
      }
      // Don't change state for mobile (< 768px) as it uses different navigation
    };

    // Set initial state based on screen size
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isTablet]);

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    console.log('Right sidebar mode changed to:', mode);
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    console.log('🔧 FIGMANT LAYOUT - Manual collapse change:', collapsed);
    setIsSidebarCollapsed(collapsed);
  };

  console.log('🔧 FIGMANT LAYOUT - Current state:', {
    activeSection,
    selectedAnalysis,
    isSidebarCollapsed,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    isMobile,
    isTablet
  });

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col w-full overflow-hidden" style={{ background: 'transparent' }}>
        {/* Mobile Header with Navigation */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">figmant</h1>
          <MobileNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
        
        {/* Mobile Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <FigmantMainContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
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
    <div className="min-h-screen h-screen flex w-full gap-4 overflow-hidden" style={{ background: 'transparent' }}>
      <div className="flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCollapsedChange={handleSidebarCollapsedChange}
        />
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <FigmantMainContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedAnalysis={selectedAnalysis}
          onBackToList={handleBackToList}
          onRightSidebarModeChange={handleRightSidebarModeChange}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </div>
  );
};
