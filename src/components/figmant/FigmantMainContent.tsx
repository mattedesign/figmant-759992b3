
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
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  setActiveSection,
  selectedAnalysis,
  onBackToList,
  onRightSidebarModeChange
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
    <div className="flex-1 h-screen overflow-hidden p-4" style={{ background: 'transparent' }}>
      <div 
        className={`h-full bg-[#F9FAFB] ${needsScrolling ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{
          borderRadius: '24px',
          border: '1px solid rgba(10, 12, 17, 0.10)',
          boxShadow: '0px 0px 0px 1px rgba(255, 255, 255, 0.18), 0px 18px 36px 0px rgba(18, 18, 23, 0.02), 0px 8px 14px 0px rgba(18, 18, 23, 0.03), 0px 4px 6px 0px rgba(18, 18, 23, 0.03), 0px 2px 3px 0px rgba(18, 18, 23, 0.03)'
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};
