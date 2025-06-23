
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FigmantSidebar } from './navigation/FigmantSidebar';
import { FigmantTopNavigation } from './navigation/FigmantTopNavigation';
import { DashboardPage } from './pages/DashboardPage';
import { InsightsPage } from './pages/InsightsPage';
import { PremiumAnalysisPage } from './pages/premium-analysis/PremiumAnalysisPage';
import { AllAnalysisPageWrapper } from './pages/analysis/AllAnalysisPageWrapper';
import { AdvancedDesignAnalysisPageContent } from '../design/AdvancedDesignAnalysisPageContent';
import { ProcessingPage } from '../design/ProcessingPage';
import { PromptsPage } from '../design/PromptsPage';
import { AnalysisHistoryPage } from '../design/AnalysisHistoryPage';
import { PerformanceAnalyticsDashboard } from './analytics/PerformanceAnalyticsDashboard';
import ProfilePage from '../../pages/ProfilePage';
import AdminAssets from '../../pages/AdminAssets';
import { useAuth } from '@/contexts/AuthContext';

export const FigmantLayout: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const { user } = useAuth();
  
  // Default to dashboard if no section specified
  const currentSection = section || 'dashboard';

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'insights':
        return <InsightsPage />;
      case 'premium-analysis':
        return <PremiumAnalysisPage />;
      case 'analysis':
        return <AllAnalysisPageWrapper />;
      case 'upload':
        return <AdvancedDesignAnalysisPageContent />;
      case 'processing':
        return <ProcessingPage />;
      case 'prompts':
        return <PromptsPage />;
      case 'history':
        return <AnalysisHistoryPage />;
      case 'analytics':
        return <PerformanceAnalyticsDashboard />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        // Only show admin for owner
        if (user?.user_metadata?.role === 'owner') {
          return <AdminAssets />;
        }
        return <Navigate to="/figmant/dashboard" replace />;
      default:
        return <Navigate to="/figmant/dashboard" replace />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <FigmantSidebar currentSection={currentSection} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <FigmantTopNavigation currentSection={currentSection} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
