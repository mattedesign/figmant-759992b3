
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerDashboardErrorBoundary } from '@/components/owner/OwnerDashboardErrorBoundary';
import { IconSidebar } from '@/components/owner/IconSidebar';
import { SecondaryNavigation } from '@/components/owner/SecondaryNavigation';
import { useSearchParams } from 'react-router-dom';

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

  console.log('Rendering OwnerDashboard with tab:', activeTab, 'section:', activeSection);
  
  return (
    <OwnerDashboardErrorBoundary>
      <div className="min-h-screen flex w-full bg-background">
        {/* Icon Sidebar */}
        <IconSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        {/* Main Content Area with Navigation and Content */}
        <div className="flex-1 flex flex-col">
          <Navigation showSidebarTrigger={false} />
          
          <main className="flex-1 flex overflow-hidden">
            <SecondaryNavigation 
              activeSection={activeSection}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </main>
        </div>
      </div>
    </OwnerDashboardErrorBoundary>
  );
};

export default OwnerDashboard;
