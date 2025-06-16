
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  // Handle navigation state from premium analysis
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
        return <AnalysisPage />;
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

  return (
    <div className="flex-1 h-screen overflow-hidden p-4" style={{ background: 'transparent' }}>
      <div 
        className="h-full overflow-hidden bg-[#F9FAFB]"
        style={{
          borderRadius: '32px',
          border: '1px solid rgba(10, 12, 17, 0.10)',
          boxShadow: '0px 0px 0px 1px rgba(255, 255, 255, 0.24), 0px 24px 48px 0px rgba(18, 18, 23, 0.03), 0px 10px 18px 0px rgba(18, 18, 23, 0.03), 0px 5px 8px 0px rgba(18, 18, 23, 0.04), 0px 2px 4px 0px rgba(18, 18, 23, 0.04)'
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};
