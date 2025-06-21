
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AllAnalysisPageWrapper } from '@/components/design/analysis/AllAnalysisPageWrapper';
import { AdvancedDesignAnalysisPageContent } from '@/components/design/AdvancedDesignAnalysisPageContent';
import { CompetitorAnalysisPage } from '@/components/figmant/pages/analysis/CompetitorAnalysisPage';
import { PremiumAnalysisWizard } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisWizard';
import { PremiumAnalysisTabController } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisTabController';

// Lazy load other content components
const InsightsPage = lazy(() => import('@/components/design/InsightsPage').then(module => ({
  default: module.InsightsPage
})));
const PromptsPage = lazy(() => import('@/components/design/PromptsPage').then(module => ({
  default: module.PromptsPage
})));
const PremiumAnalysisPage = lazy(() => import('@/components/design/PremiumAnalysisPage').then(module => ({
  default: module.PremiumAnalysisPage
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
  console.log('🎯 SUBSCRIBER TAB CONTENT RENDERER - activeTab received:', activeTab);
  
  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'competitor-analysis':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading CompetitorAnalysisPage for tab:', activeTab);
        return (
          <div className="h-full w-full">
            <CompetitorAnalysisPage />
          </div>
        );
      case 'design':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading AdvancedDesignAnalysisPageContent for tab:', activeTab);
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
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading AllAnalysisPageWrapper for tab:', activeTab);
        return <AllAnalysisPageWrapper />;
      case 'insights':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading InsightsPage for tab:', activeTab);
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <InsightsPage />
          </Suspense>
        );
      case 'prompts':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading PromptsPage for tab:', activeTab);
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PromptsPage />
          </Suspense>
        );
      case 'wizard-analysis':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading PremiumAnalysisWizard for tab:', activeTab);
        return <PremiumAnalysisWizard />;
      case 'premium-analysis':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading PremiumAnalysisTabController for tab:', activeTab);
        return <PremiumAnalysisTabController />;
      case 'integrations':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading IntegrationsPage for tab:', activeTab);
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <IntegrationsPage />
          </Suspense>
        );
      // Hidden pages - keep functional but not shown in navigation
      case 'batch':
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading BatchAnalysisDashboard for tab:', activeTab);
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
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading UnifiedAnalysisHistory for tab:', activeTab);
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
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading DesignList for tab:', activeTab);
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
        console.log('✅ SUBSCRIBER TAB RENDERER - Loading default AdvancedDesignAnalysisPageContent for tab:', activeTab);
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
