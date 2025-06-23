
import React from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { InsightsPage } from './pages/InsightsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ChatPage } from './pages/ChatPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CreditsPage } from './pages/CreditsPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { SearchPage } from './pages/SearchPage';
import { WizardPage } from './pages/WizardPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';

interface FigmantMainContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedAnalysis: any;
  onBackToList: () => void;
  onRightSidebarModeChange: (mode: string) => void;
  isSidebarCollapsed: boolean;
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  setActiveSection,
  selectedAnalysis,
  onBackToList,
  onRightSidebarModeChange,
  isSidebarCollapsed,
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'insights':
        return <InsightsPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'chat':
        return <ChatPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'credits':
        return <CreditsPage />;
      case 'preferences':
        return <PreferencesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      case 'search':
        return <SearchPage />;
      case 'wizard':
        return <WizardPage />;
      case 'premium-analysis':
        return <PremiumAnalysisPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden">
      {renderContent()}
    </div>
  );
};
