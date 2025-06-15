
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { SubscriberDashboardErrorBoundary } from '@/components/subscriber/SubscriberDashboardErrorBoundary';
import { IconSidebar } from '@/components/subscriber/IconSidebar';
import { SecondaryNavigation } from '@/components/subscriber/SecondaryNavigation';
import { TabContentRenderer } from '@/components/subscriber/components/TabContentRenderer';
import { useSearchParams } from 'react-router-dom';

// Map tabs to sections for the subscriber navigation
const tabToSectionMap: Record<string, string> = {
  design: 'workspace',
  'all-analysis': 'workspace',
  insights: 'workspace',
  prompts: 'workspace',
  'premium-analysis': 'workspace',
  integrations: 'workspace',
  batch: 'workspace', // Hidden but functional
  history: 'workspace', // Hidden but functional
  legacy: 'workspace', // Hidden but functional
};

const SubscriberDashboard = () => {
  console.log('SubscriberDashboard component mounting...');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the tab from URL parameters, default to 'design' (first available tab)
  const tabFromUrl = searchParams.get('tab') || 'design';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [activeSection, setActiveSection] = useState(tabToSectionMap[tabFromUrl] || 'workspace');

  // Valid tab options - including hidden tabs for direct access
  const validTabs = ['design', 'all-analysis', 'insights', 'prompts', 'premium-analysis', 'integrations', 'batch', 'history', 'legacy'];
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
    
    // Set the first available tab for the section (prioritize visible tabs)
    const sectionTabs = Object.entries(tabToSectionMap)
      .filter(([_, section]) => section === newSection)
      .map(([tab, _]) => tab);
    
    if (sectionTabs.length > 0) {
      // For workspace, prefer 'design' first, then 'all-analysis'
      let firstTab = sectionTabs[0];
      if (newSection === 'workspace') {
        if (sectionTabs.includes('design')) {
          firstTab = 'design';
        } else if (sectionTabs.includes('all-analysis')) {
          firstTab = 'all-analysis';
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
      setActiveSection('workspace');
      setSearchParams({
        tab: 'design'
      });
    } else {
      setActiveTab(currentTab);
      setActiveSection(tabToSectionMap[currentTab] || 'workspace');
    }
  }, [searchParams]);

  console.log('Rendering SubscriberDashboard with tab:', activeTab, 'section:', activeSection);
  
  return (
    <SubscriberDashboardErrorBoundary>
      <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
        {/* Top Navigation - Fixed */}
        <div className="flex-none">
          <Navigation showSidebarTrigger={false} />
        </div>
        
        {/* Main Content Area - Flexible */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Container - Fixed Width, No Scroll */}
          <div className="flex-none flex">
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
          </div>
          
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-auto bg-[#F5F6FA]">
            <TabContentRenderer activeTab={activeTab} />
          </div>
        </div>
      </div>
    </SubscriberDashboardErrorBoundary>
  );
};

export default SubscriberDashboard;
