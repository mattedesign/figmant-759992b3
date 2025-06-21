import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AllAnalysisPageWrapper } from '@/components/design/analysis/AllAnalysisPageWrapper';
import { AdvancedDesignAnalysisPageContent } from '@/components/design/AdvancedDesignAnalysisPageContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Lazy load other content components
const InsightsPage = lazy(() => import('@/components/design/InsightsPage').then(module => ({
  default: module.InsightsPage
})));
const PromptsPage = lazy(() => import('@/components/design/PromptsPage').then(module => ({
  default: module.PromptsPage
})));
const IntegrationsPage = lazy(() => import('@/components/design/IntegrationsPage').then(module => ({
  default: module.IntegrationsPage
})));
const BatchAnalysisDashboard = lazy(() => import('@/components/design/BatchAnalysisDashboard').then(module => ({
  default: module.BatchAnalysisDashboard
})));
const UnifiedAnalysisHistory = lazy(() => import('@/components/design/UnifiedAnalysisHistory').then(module => ({
  default: module.UnifiedAnalysisHistory
})));
const DesignList = lazy(() => import('@/components/design/DesignList').then(module => ({
  default: module.DesignList
})));

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'design':
        return (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
                <p className="text-muted-foreground">
                  Chat with AI for comprehensive UX insights and design analysis
                </p>
              </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <AdvancedDesignAnalysisPageContent />
            </Suspense>
          </div>
        );
      case 'all-analysis':
        return <AllAnalysisPageWrapper />;
      case 'insights':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <InsightsPage />
          </Suspense>
        );
      case 'prompts':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PromptsPage />
          </Suspense>
        );
      case 'wizard-analysis':
        return (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Wizard Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Wizard analysis functionality is currently being restructured. Please use the design analysis tab for comprehensive analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'integrations':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <IntegrationsPage />
          </Suspense>
        );
      // Hidden pages - keep functional but not shown in navigation
      case 'batch':
        return (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Batch Analysis</h1>
                <p className="text-muted-foreground">
                  Analyze multiple designs simultaneously for comprehensive insights
                </p>
              </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <BatchAnalysisDashboard />
            </Suspense>
          </div>
        );
      case 'history':
        return (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
                <p className="text-muted-foreground">
                  View and manage all your design analysis history
                </p>
              </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <UnifiedAnalysisHistory onViewAnalysis={(upload) => console.log('Viewing analysis:', upload.id, upload.file_name)} />
            </Suspense>
          </div>
        );
      case 'legacy':
        return (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Legacy Design View</h1>
                <p className="text-muted-foreground">
                  Classic view of uploaded designs and analysis
                </p>
              </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <DesignList onViewAnalysis={(upload) => console.log('Viewing analysis:', upload.id, upload.file_name)} />
            </Suspense>
          </div>
        );
      default:
        return (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
                <p className="text-muted-foreground">
                  Chat with AI for comprehensive UX insights and design analysis
                </p>
              </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <AdvancedDesignAnalysisPageContent />
            </Suspense>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full">
      {renderTabContent(activeTab)}
    </div>
  );
};
