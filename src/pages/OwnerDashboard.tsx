
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerDashboardErrorBoundary } from '@/components/owner/OwnerDashboardErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load content components
const DesignChatInterface = lazy(() => import('@/components/design/DesignChatInterface').then(module => ({
  default: module.DesignChatInterface
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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const OwnerDashboard = () => {
  console.log('OwnerDashboard component mounting...');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the tab from URL parameters, default to 'design'
  const tabFromUrl = searchParams.get('tab') || 'design';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Valid tab options
  const validTabs = ['design', 'batch', 'history', 'legacy', 'users', 'plans', 'claude', 'settings'];
  console.log('Current tab:', activeTab);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    console.log('Changing tab to:', newTab);
    setActiveTab(newTab);
    setSearchParams({
      tab: newTab
    });
  };

  // Sync tab state with URL changes and handle invalid tabs
  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'design';
    console.log('URL tab changed to:', currentTab);

    // If the current tab is invalid, redirect to default
    if (!validTabs.includes(currentTab)) {
      console.log('Invalid tab detected, redirecting to design tab');
      setActiveTab('design');
      setSearchParams({
        tab: 'design'
      });
    } else {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'design':
        return (
          <div className="space-y-6">
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
      case 'batch':
        return (
          <div className="space-y-6">
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
          <div className="space-y-6">
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
          <div className="space-y-6">
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
          <Suspense fallback={<LoadingSpinner />}>
            <UserManagement />
          </Suspense>
        );
      case 'plans':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SubscriptionPlansManager />
          </Suspense>
        );
      case 'claude':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ClaudeSettings />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminSettings />
          </Suspense>
        );
      default:
        return (
          <div className="space-y-6">
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

  console.log('Rendering OwnerDashboard with tab:', activeTab);
  
  return (
    <OwnerDashboardErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="design">AI Chat</TabsTrigger>
              <TabsTrigger value="batch">Batch</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="legacy">Legacy</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="claude">Claude</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {renderTabContent(activeTab)}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </OwnerDashboardErrorBoundary>
  );
};

export default OwnerDashboard;
