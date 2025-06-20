
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { migrateNavigationRoute } from '@/utils/navigationMigration';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ChatPage } from './pages/ChatPage';
import { WizardPage } from './pages/WizardPage';
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
      const migratedSection = migrateNavigationRoute(location.state.activeSection);
      setActiveSection(migratedSection);
    }
  }, [location.state, setActiveSection]);

  const renderContent = () => {
    // Apply migration to current activeSection for backward compatibility
    const currentSection = migrateNavigationRoute(activeSection);
    
    switch (currentSection) {
      // New standardized navigation IDs - MVP Priority Order
      case 'dashboard':
        return <DashboardPage />;
      
      case 'competitor-analysis':
        // UC-024 - AI Competitor Analysis (MVP Priority 1)
        return <ChatPage selectedTemplate={location.state?.selectedTemplate} />;
      
      case 'revenue-analysis':
        // UC-018 - E-commerce Revenue Impact (MVP Priority 2)
        return <PremiumAnalysisPage />;
      
      case 'templates':
        return <TemplatesPage />;
      
      case 'credits':
        return <CreditsPage />;
      
      case 'settings':
        return <PreferencesPage />;
      
      case 'help-support':
        return <PreferencesPage />;
      
      case 'admin':
        return <AdminPage initialTab={activeSection} />;
      
      // Legacy routes - maintain backward compatibility during transition
      case 'chat':
      case 'analysis':
      case 'wizard':
        // These now redirect to competitor-analysis
        return <ChatPage selectedTemplate={location.state?.selectedTemplate} />;
      
      case 'premium-analysis':
        // This now redirects to revenue-analysis
        return <PremiumAnalysisPage />;
      
      case 'preferences':
        // This now redirects to settings
        return <PreferencesPage />;
      
      case 'search':
        return <SearchPage />;
        
      // Admin sub-routes
      case 'users':
      case 'claude':
      case 'plans':
      case 'products':
      case 'assets':
      case 'prompt-manager':
        return <AdminPage initialTab={activeSection} />;
      
      case 'support':
        return <PreferencesPage />;
      
      default:
        // Default to dashboard for unknown routes
        return <DashboardPage />;
    }
  };

  // Determine if we need scrolling based on the active section
  const needsScrolling = activeSection === 'revenue-analysis' || activeSection === 'wizard';

  if (isMobile) {
    return (
      <div className="flex-1 h-full overflow-hidden">
        <div className={`h-full ${needsScrolling ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'transparent' }} className="h-full overflow-y-auto">
      <div className="h-full">
        {renderContent()}
      </div>
    </div>
  );
};
