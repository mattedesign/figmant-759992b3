
import React from 'react';
import { DesignChatInterface } from '@/components/design/DesignChatInterface';
import { AllAnalysisPageEnhanced } from '@/components/design/analysis/AllAnalysisPageEnhanced';
import { AnalysisDetailView } from '@/components/design/analysis/AnalysisDetailView';
import { Dashboard } from '@/pages/Dashboard';

interface FigmantMainContentProps {
  activeSection: string;
  selectedAnalysis: any;
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  selectedAnalysis
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'design-analysis':
        if (selectedAnalysis) {
          return (
            <AnalysisDetailView 
              analysis={selectedAnalysis}
              onBack={() => {}}
            />
          );
        }
        return <DesignChatInterface />;

      case 'dashboard':
        return (
          <div className="p-6">
            <Dashboard />
          </div>
        );

      case 'analytics':
        return (
          <div className="p-6">
            <AllAnalysisPageEnhanced />
          </div>
        );

      case 'settings':
        return (
          <div className="p-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              <div className="space-y-6">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your default analysis settings and preferences.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your account details and subscription.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Figmant</h2>
              <p className="text-muted-foreground">
                Select a section from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {renderContent()}
    </div>
  );
};
