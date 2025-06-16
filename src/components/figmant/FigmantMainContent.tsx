
import React from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SearchPage } from './pages/SearchPage';
import { CreditsPage } from './pages/CreditsPage';
import { PreferencesPage } from './pages/PreferencesPage';

interface FigmantMainContentProps {
  activeSection: string;
  selectedAnalysis: any;
  onBackToList: () => void;
  onRightSidebarModeChange: (mode: string) => void;
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  selectedAnalysis,
  onBackToList,
  onRightSidebarModeChange
}) => {
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
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
      {renderContent()}
    </div>
  );
};
