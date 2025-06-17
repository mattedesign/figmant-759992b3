
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SearchPage } from './pages/SearchPage';
import { CreditsPage } from './pages/CreditsPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { AdminPage } from './pages/AdminPage';

interface FigmantMainContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedAnalysis: any;
  onBackToList: () => void;
  onRightSidebarModeChange: (mode: string) => void;
  isSidebarCollapsed?: boolean;
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  setActiveSection,
  selectedAnalysis,
  onBackToList,
  onRightSidebarModeChange,
  isSidebarCollapsed = true
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Handle navigation state from premium analysis, template selection, or admin access
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state, setActiveSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'analysis':
        return <AnalysisPage selectedTemplate={location.state?.selectedTemplate} />;
      case 'premium-analysis':
        return <PremiumAnalysisPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'search':
        return <SearchPage />;
      case 'credits':
        return <CreditsPage />;
      case 'preferences':
        return <PreferencesPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Determine if we need scrolling based on the active section
  const needsScrolling = activeSection === 'premium-analysis';

  if (isMobile) {
    return (
      <div className="flex-1 h-full overflow-hidden">
        <div 
          className={`h-full bg-[#F9FAFB] ${needsScrolling ? 'overflow-y-auto' : 'overflow-hidden'}`}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex-1 h-screen overflow-hidden transition-all duration-300 ${
        isSidebarCollapsed ? 'p-4 pl-2' : 'p-4 pl-2'
      }`} 
      style={{ background: 'transparent' }}
    >
      <div 
        className={`h-full bg-[#F9FAFB] ${needsScrolling ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{
          borderRadius: '24px',
          border: '1px solid rgba(10, 12, 17, 0.10)',
          boxShadow: '0px 0px 0px 1px rgba(255, 255, 255, 0.18), 0px 13.5px 27px 0px rgba(18, 18, 23, 0.015), 0px 6px 10.5px 0px rgba(18, 18, 23, 0.0225), 0px 3px 4.5px 0px rgba(18, 18, 23, 0.0225), 0px 1.5px 2.25px 0px rgba(18, 18, 23, 0.0225)'
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};
