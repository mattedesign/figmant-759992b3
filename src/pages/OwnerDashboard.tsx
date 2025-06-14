
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerDashboardErrorBoundary } from '@/components/owner/OwnerDashboardErrorBoundary';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Lazy load heavy components to prevent loading issues
import { lazy, Suspense } from 'react';
const UserManagement = lazy(() => import('@/components/owner/UserManagement').then(module => ({
  default: module.UserManagement
})));
const AdminSettings = lazy(() => import('@/components/owner/AdminSettings').then(module => ({
  default: module.AdminSettings
})));
const ClaudeSettings = lazy(() => import('@/components/owner/ClaudeSettings').then(module => ({
  default: module.ClaudeSettings
})));
const SubscriptionPlansManager = lazy(() => import('@/components/owner/SubscriptionPlansManager').then(module => ({
  default: module.SubscriptionPlansManager
})));
const AdvancedDesignAnalysisPage = lazy(() => import('@/components/design/AdvancedDesignAnalysisPage').then(module => ({
  default: module.AdvancedDesignAnalysisPage
})));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const OwnerDashboard = () => {
  console.log('OwnerDashboard component mounting...');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the tab from URL parameters, default to 'design' (first available tab)
  const tabFromUrl = searchParams.get('tab') || 'design';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Valid tab options (excluding analytics)
  const validTabs = ['design', 'users', 'plans', 'claude', 'settings'];
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

    // If the current tab is invalid (like 'analytics'), redirect to default
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

  const renderContent = () => {
    switch (activeTab) {
      case 'design':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedDesignAnalysisPage />
          </Suspense>
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
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedDesignAnalysisPage />
          </Suspense>
        );
    }
  };

  console.log('Rendering OwnerDashboard with tab:', activeTab);
  
  return (
    <OwnerDashboardErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <OwnerSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          
          <SidebarInset className="flex-1">
            <Navigation />
            
            <main className="flex-1 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <SidebarTrigger />
                <div className="h-4 w-px bg-border" />
                <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
              </div>
              
              <div className="space-y-6">
                {renderContent()}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </OwnerDashboardErrorBoundary>
  );
};

export default OwnerDashboard;
