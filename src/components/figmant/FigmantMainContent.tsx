
import React, { useState } from 'react';
import { AnalysisDetailViewer } from './analysis/AnalysisDetailViewer';
import { SmartSearchPanel } from './search/SmartSearchPanel';
import { DashboardPage } from './pages/DashboardPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CreditsPage } from './pages/CreditsPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [searchSelectedAnalysis, setSearchSelectedAnalysis] = useState<any>(null);

  const handleShareAnalysis = (analysis: any) => {
    toast({
      title: "Share Analysis",
      description: "Analysis sharing will be implemented in the next phase.",
    });
  };

  const handleDownloadAnalysis = (analysis: any) => {
    toast({
      title: "Download Report",
      description: "Report download will be implemented in the next phase.",
    });
  };

  const handleSearchResultSelect = (analysis: any) => {
    setSearchSelectedAnalysis(analysis);
    onRightSidebarModeChange('preview');
  };

  const handleBackFromSearch = () => {
    setSearchSelectedAnalysis(null);
  };

  // If we have a selected analysis from the middle panel, show detail viewer
  if (selectedAnalysis) {
    return (
      <AnalysisDetailViewer
        analysis={selectedAnalysis}
        onBack={onBackToList}
        onShare={handleShareAnalysis}
        onDownload={handleDownloadAnalysis}
      />
    );
  }

  // If we have a selected analysis from search, show detail viewer
  if (searchSelectedAnalysis) {
    return (
      <AnalysisDetailViewer
        analysis={searchSelectedAnalysis}
        onBack={handleBackFromSearch}
        onShare={handleShareAnalysis}
        onDownload={handleDownloadAnalysis}
      />
    );
  }

  // Render content based on active section
  switch (activeSection) {
    case 'analysis':
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select an Analysis
            </h3>
            <p className="text-gray-600">
              Choose an analysis from the list to view detailed results and recommendations.
            </p>
          </div>
        </div>
      );

    case 'search':
      return (
        <SmartSearchPanel
          onResultSelect={handleSearchResultSelect}
          className="h-full"
        />
      );

    case 'dashboard':
      return <DashboardPage />;

    case 'premium-analysis':
      return <PremiumAnalysisPage />;

    case 'templates':
      return <TemplatesPage />;

    case 'credits':
      return <CreditsPage />;

    case 'preferences':
      return <PreferencesPage />;

    default:
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeSection}
            </h3>
            <p className="text-gray-600">
              Content for {activeSection} will be available soon.
            </p>
          </div>
        </div>
      );
  }
};
