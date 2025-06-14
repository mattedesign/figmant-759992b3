
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerDashboardErrorBoundary } from '@/components/owner/OwnerDashboardErrorBoundary';
import { IconSidebar } from '@/components/owner/IconSidebar';
import { SecondaryNavigation } from '@/components/owner/SecondaryNavigation';
import { useSearchParams } from 'react-router-dom';

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

// Map tabs to sections for the two-level navigation
const tabToSectionMap: Record<string, string> = {
  design: 'workspace',
  users: 'users',
  plans: 'products',
  claude: 'apps',
  settings: 'settings',
  alerts: 'settings',
};

const OwnerDashboard = () => {
  console.log('OwnerDashboard component mounting...');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the tab from URL parameters, default to 'design' (first available tab)
  const tabFromUrl = searchParams.get('tab') || 'design';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [activeSection, setActiveSection] = useState(tabToSectionMap[tabFromUrl] || 'workspace');

  // Valid tab options
  const validTabs = ['design', 'users', 'plans', 'claude', 'settings'];
  console.log('Current tab:', activeTab, 'Current section:', activeSection);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    console.log('Changing tab to:', newTab);
    setActiveTab(newTab);
    setActiveSection(tabToSectionMap[newTab] || 'workspace');
    setSearchParams({
      tab: newTab
    });
  };

  // Handle section change from icon sidebar
  const handleSectionChange = (newSection: string) => {
    console.log('Changing section to:', newSection);
    setActiveSection(newSection);
    
    // Set the first available tab for the section
    const sectionTabs = Object.entries(tabToSectionMap)
      .filter(([_, section]) => section === newSection)
      .map(([tab, _]) => tab);
    
    if (sectionTabs.length > 0) {
      const firstTab = sectionTabs[0];
      setActiveTab(firstTab);
      setSearchParams({
        tab: firstTab
      });
    }
  };

  // Sync tab state with URL changes and handle invalid tabs
  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'design';
    console.log('URL tab changed to:', currentTab);

    // If the current tab is invalid, redirect to default
    if (!validTabs.includes(currentTab)) {
      console.log('Invalid tab detected, redirecting to design tab');
      setActiveTab('design');
      setActiveSection('workspace');
      setSearchParams({
        tab: 'design'
      });
    } else {
      setActiveTab(currentTab);
      setActiveSection(tabToSectionMap[currentTab] || 'workspace');
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

  console.log('Rendering OwnerDashboard with tab:', activeTab, 'section:', activeSection);
  
  return (
    <OwnerDashboardErrorBoundary>
      <div className="min-h-screen flex w-full bg-background">
        {/* Icon Sidebar */}
        <IconSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        {/* Secondary Navigation */}
        <SecondaryNavigation 
          activeSection={activeSection}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Navigation showSidebarTrigger={false} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </OwnerDashboardErrorBoundary>
  );
};

export default OwnerDashboard;
