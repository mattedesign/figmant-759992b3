
import React from 'react';
import { AnalysisPage } from './pages/analysis/AnalysisPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreditsPage } from './pages/CreditsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';
import { WizardPage } from './pages/WizardPage';
import { ChatPage } from './pages/ChatPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { AdminPage } from './pages/AdminPage';

interface FigmantMainContentProps {
  activeSection: string;
  isSidebarCollapsed?: boolean;
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  isSidebarCollapsed = false
}) => {
  console.log('🎯 FIGMANT MAIN CONTENT - Rendering section:', activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      
      // All analysis-related sections route to AnalysisPage
      case 'design':
      case 'competitor-analysis':
      case 'conversion-optimization':
      case 'visual-hierarchy':
      case 'all-analysis':
      case 'insights':
      case 'prompts':
      case 'premium-analysis':
      case 'integrations':
        return <AnalysisPage />;
      
      case 'credits':
        return <CreditsPage />;
      
      case 'templates':
        return <TemplatesPage />;
      
      case 'wizard-analysis':
        return <WizardPage />;
      
      case 'chat':
        return <ChatPage />;
      
      case 'analytics':
        return <AnalyticsPage />;
      
      case 'preferences':
      case 'settings':
        return <PreferencesPage />;
      
      case 'admin':
        return <AdminPage />;
      
      default:
        console.log('🎯 FIGMANT MAIN CONTENT - Unknown section, defaulting to AnalysisPage:', activeSection);
        return <AnalysisPage />;
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      {renderContent()}
    </div>
  );
};
