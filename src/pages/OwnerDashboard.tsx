
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerDashboardErrorBoundary } from '@/components/owner/OwnerDashboardErrorBoundary';
import { IconSidebar } from '@/components/owner/IconSidebar';
import { SecondaryNavigation } from '@/components/owner/SecondaryNavigation';
import { TabContentRenderer } from '@/components/owner/components/TabContentRenderer';
import { FigmantSidebar } from '@/components/figmant/sidebar/FigmantSidebarContainer';
import { useSearchParams } from 'react-router-dom';

// Map tabs to sections for the navigation
const tabToSectionMap: Record<string, string> = {
  design: 'dashboard',
  'all-analysis': 'dashboard',
  insights: 'dashboard',
  prompts: 'dashboard',
  'premium-analysis': 'dashboard',
  integrations: 'dashboard',
  batch: 'dashboard',
  history: 'dashboard',
  legacy: 'dashboard',
  users: 'admin',
  plans: 'admin',
  claude: 'admin',
  settings: 'admin',
  alerts: 'admin',
  'prompt-manager': 'admin',
};

const OwnerDashboard = () => {
  console.log('OwnerDashboard component mounting...');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the tab from URL parameters, default to 'design' (first available tab)
  const tabFromUrl = searchParams.get('tab') || 'design';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [activeSection, setActiveSection] = useState(tabToSectionMap[tabFromUrl] || 'dashboard');

  // Valid tab options - including hidden tabs for direct access
  const validTabs = ['design', 'all-analysis', 'insights', 'prompts', 'premium-analysis', 'integrations', 'batch', 'history', 'legacy', 'users', 'plans', 'claude', 'settings', 'prompt-manager'];
  console.log('Current tab:', activeTab, 'Current section:', activeSection);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    console.log('Changing tab to:', newTab);
    setActiveTab(newTab);
    setActiveSection(tabToSectionMap[newTab] || 'dashboard');
    setSearchParams({
      tab: newTab
    });
  };

  // Handle section change from figmant sidebar
  const handleSectionChange = (newSection: string) => {
    console.log('Changing section to:', newSection);
    setActiveSection(newSection);
    
    // Set the first available tab for the section
    const sectionTabs = Object.entries(tabToSectionMap)
      .filter(([_, section]) => section === newSection)
      .map(([tab, _]) => tab);
    
    if (sectionTabs.length > 0) {
      let firstTab = sectionTabs[0];
      if (newSection === 'dashboard') {
        // For dashboard, prefer 'design' first
        if (sectionTabs.includes('design')) {
          firstTab = 'design';
        } else if (sectionTabs.includes('all-analysis')) {
          firstTab = 'all-analysis';
        }
      } else if (newSection === 'admin') {
        // For admin, prefer 'users' first
        if (sectionTabs.includes('users')) {
          firstTab = 'users';
        }
      }
      
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
      setActiveSection('dashboard');
      setSearchParams({
        tab: 'design'
      });
    } else {
      setActiveTab(currentTab);
      setActiveSection(tabToSectionMap[currentTab] || 'dashboard');
    }
  }, [searchParams, setSearchParams]);

  console.log('Rendering OwnerDashboard with tab:', activeTab, 'section:', activeSection);
  
  return (
    <OwnerDashboardErrorBoundary>
      <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
        {/* Top Navigation - Fixed */}
        <div className="flex-none">
          <Navigation showSidebarTrigger={false} />
        </div>
        
        {/* Main Content Area - Flexible */}
        <div className="flex-1 flex overflow-hidden">
          {/* Unified Figmant Navigation */}
          <div className="flex-none">
            <FigmantSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
          
          {/* Secondary Navigation for tabs within sections */}
          <div className="flex-none">
            <SecondaryNavigation 
              activeSection={activeSection}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
          
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-auto bg-[#F5F6FA]">
            <TabContentRenderer activeTab={activeTab} />
          </div>
        </div>
      </div>
    </OwnerDashboardErrorBoundary>
  );
};

export default OwnerDashboard;
