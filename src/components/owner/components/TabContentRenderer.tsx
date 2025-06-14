import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load content components
const DesignChatInterface = lazy(() => import('@/components/design/DesignChatInterface').then(module => ({
  default: module.DesignChatInterface
})));
const AllAnalysisPage = lazy(() => import('@/components/design/AllAnalysisPage').then(module => ({
  default: module.AllAnalysisPage
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
const UserManagement = lazy(() => import('@/components/owner/UserManagement').then(module => ({
  default: module.UserManagement
})));
const SubscriptionPlansManager = lazy(() => import('@/components/owner/SubscriptionPlansManager').then(module => ({
  default: module.SubscriptionPlansManager
})));
const ClaudeSettings = lazy(() => import('@/components/owner/ClaudeSettings').then(module => ({
  default: module.ClaudeSettings
})));
const AdminSettings = lazy(() => import('@/components/owner/AdminSettings').then(module => ({
  default: module.AdminSettings
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
              <DesignChatInterface />
            </Suspense>
          </div>
        );
      case 'all-analysis':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AllAnalysisPage />
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
      case 'users':
        return (
          <div className="h-full overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <UserManagement />
            </Suspense>
          </div>
        );
      case 'plans':
        return (
          <div className="h-full overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <SubscriptionPlansManager />
            </Suspense>
          </div>
        );
      case 'claude':
        return (
          <div className="h-full overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <ClaudeSettings />
            </Suspense>
          </div>
        );
      case 'settings':
        return (
          <div className="h-full overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSettings />
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
              <DesignChatInterface />
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
