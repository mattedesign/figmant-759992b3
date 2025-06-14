
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerDashboardErrorBoundary } from '@/components/owner/OwnerDashboardErrorBoundary';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Lazy load heavy components to prevent loading issues
import { lazy, Suspense } from 'react';

const UserManagement = lazy(() => import('@/components/owner/UserManagement').then(module => ({ default: module.UserManagement })));
const AdminSettings = lazy(() => import('@/components/owner/AdminSettings').then(module => ({ default: module.AdminSettings })));
const ClaudeSettings = lazy(() => import('@/components/owner/ClaudeSettings').then(module => ({ default: module.ClaudeSettings })));
const SubscriptionPlansManager = lazy(() => import('@/components/owner/SubscriptionPlansManager').then(module => ({ default: module.SubscriptionPlansManager })));
const AdvancedDesignAnalysisPage = lazy(() => import('@/components/design/AdvancedDesignAnalysisPage').then(module => ({ default: module.AdvancedDesignAnalysisPage })));

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
    setSearchParams({ tab: newTab });
  };

  // Sync tab state with URL changes and handle invalid tabs
  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'design';
    console.log('URL tab changed to:', currentTab);
    
    // If the current tab is invalid (like 'analytics'), redirect to default
    if (!validTabs.includes(currentTab)) {
      console.log('Invalid tab detected, redirecting to design tab');
      setActiveTab('design');
      setSearchParams({ tab: 'design' });
    } else {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  console.log('Rendering OwnerDashboard with tab:', activeTab);

  return (
    <OwnerDashboardErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your UX Analytics platform and monitor business metrics
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="design">Design Analysis</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="plans">Plans & Products</TabsTrigger>
              <TabsTrigger value="claude">Claude AI</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="mt-6">
              <Suspense fallback={<LoadingSpinner />}>
                <AdvancedDesignAnalysisPage />
              </Suspense>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Suspense fallback={<LoadingSpinner />}>
                <UserManagement />
              </Suspense>
            </TabsContent>

            <TabsContent value="plans" className="mt-6">
              <Suspense fallback={<LoadingSpinner />}>
                <SubscriptionPlansManager />
              </Suspense>
            </TabsContent>

            <TabsContent value="claude" className="mt-6">
              <Suspense fallback={<LoadingSpinner />}>
                <ClaudeSettings />
              </Suspense>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSettings />
              </Suspense>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </OwnerDashboardErrorBoundary>
  );
};

export default OwnerDashboard;
