
import React from 'react';
import { useLocation } from 'react-router-dom';
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
import { migrateNavigationRoute } from '@/utils/navigationMigration';

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
  const location = useLocation();

  const renderContent = () => {
    // Apply migration to current activeSection for backward compatibility
    const currentSection = migrateNavigationRoute(activeSection);
    
    switch (currentSection) {
      // Core Application Routes
      case 'dashboard':
        return <DashboardPage activeSection={activeSection} onSectionChange={setActiveSection} user={undefined} />;
      
      case 'insights':
        return <InsightsPage activeSection={activeSection} onSectionChange={setActiveSection} user={undefined} />;
      
      case 'competitor-analysis':
        // UC-024 - AI Competitor Analysis (Chat Interface)
        return <ChatPage selectedTemplate={location.state?.selectedTemplate} />;
      
      case 'wizard-analysis':
        // Direct to stepped wizard process (4-step flow)
        return <WizardPage />;
      
      case 'premium-analysis':
        // UC-018 - E-commerce Revenue Impact (tabbed interface)
        return <PremiumAnalysisPage />;
      
      case 'templates':
        return <TemplatesPage />;
      
      case 'analytics':
        return <AnalyticsPage />;
      
      case 'credits':
        return <CreditsPage />;
      
      case 'settings':
        return <PreferencesPage />;
      
      case 'preferences':
        return <PreferencesPage />;
      
      case 'profile':
        return <ProfilePage />;
      
      case 'help-support':
        return <PreferencesPage />;
      
      case 'admin':
        return <AdminPage />;
      
      case 'search':
        return <SearchPage />;
      
      // Legacy Routes - Redirect with proper content
      case 'analysis':
        // Legacy analysis route -> Competitor Analysis
        return <ChatPage selectedTemplate={location.state?.selectedTemplate} />;
      
      case 'chat':
        // Legacy chat route -> Competitor Analysis
        return <ChatPage selectedTemplate={location.state?.selectedTemplate} />;
      
      case 'wizard':
        // Legacy wizard route -> Wizard Analysis
        return <WizardPage />;
      
      default:
        // Default to dashboard for unknown routes
        return <DashboardPage activeSection={activeSection} onSectionChange={setActiveSection} user={undefined} />;
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden">
      {renderContent()}
    </div>
  );
};
