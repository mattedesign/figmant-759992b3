
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CollapsibleSidebar } from './navigation/CollapsibleSidebar';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';
import { AllAnalysesGridPage } from './pages/AllAnalysesGridPage';
import { CreditsPage } from './pages/CreditsPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { SupportPage } from './pages/SupportPage';
import { AdminPage } from './pages/AdminPage';
import { useAuth } from '@/contexts/AuthContext';

export const FigmantLayout: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle navigation state from router
  useEffect(() => {
    const state = location.state as any;
    if (state?.activeSection) {
      setActiveSection(state.activeSection);
    }
  }, [location.state]);

  const isOwner = profile?.role === 'owner';

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <AnalysisPage />;
      case 'wizard':
        return <PremiumAnalysisPage />;
      case 'all-analyses':
        return <AllAnalysesGridPage />;
      case 'credits':
        return <CreditsPage />;
      case 'preferences':
        return <PreferencesPage />;
      case 'support':
        return <SupportPage />;
      case 'admin':
        return isOwner ? <AdminPage /> : <DashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#DDE3E9] overflow-hidden">
      <CollapsibleSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-4 mr-4">
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};
