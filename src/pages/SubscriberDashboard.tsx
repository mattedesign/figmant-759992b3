
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { SubscriberDashboardErrorBoundary } from '@/components/subscriber/SubscriberDashboardErrorBoundary';
import { SubscriberSidebar } from '@/components/subscriber/SubscriberSidebar';
import { TabContentRenderer } from '@/components/subscriber/components/TabContentRenderer';
import { FigmantSidebar } from '@/components/figmant/sidebar/FigmantSidebarContainer';
import { useSearchParams } from 'react-router-dom';
import { migrateNavigationRoute } from '@/utils/navigationMigration';

// Updated tab to section mapping aligned with new navigation structure
const tabToSectionMap: Record<string, string> = {
  design: 'dashboard',
  'all-analysis': 'dashboard',
  insights: 'dashboard',
  prompts: 'templates',
  integrations: 'dashboard',
  batch: 'dashboard',
  history: 'dashboard',
  legacy: 'dashboard',
  // New standardized mappings
  'competitor-analysis': 'competitor-analysis',
  'wizard-analysis': 'wizard-analysis',
  'premium-analysis': 'premium-analysis',
  templates: 'templates',
  credits: 'credits',
  settings: 'settings',
  'help-support': 'help-support',
  // Legacy mappings for backward compatibility
  wizard: 'wizard-analysis',
  'revenue-analysis': 'premium-analysis',
  preferences: 'settings',
};

const SubscriberDashboard = () => {
  console.log('SubscriberDashboard component mounting...');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the tab from URL parameters, default to 'design' (first available tab)
  const tabFromUrl = searchParams.get('tab') || 'design';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [activeSection, setActiveSection] = useState(
    migrateNavigationRoute(tabToSectionMap[tabFromUrl] || 'dashboard')
  );

  // Valid tab options - including hidden tabs for direct access
  const validTabs = [
    'design', 'all-analysis', 'insights', 'prompts', 'integrations', 'batch', 'history', 'legacy',
    'competitor-analysis', 'wizard-analysis', 'premium-analysis', 'templates', 'credits', 'settings', 'help-support',
    // Legacy tabs for backward compatibility
    'wizard', 'revenue-analysis', 'preferences'
  ];
  console.log('🔍 SUBSCRIBER DASHBOARD - Current tab:', activeTab, 'Current section:', activeSection);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    console.log('🔍 SUBSCRIBER DASHBOARD - Tab change requested:', newTab);
    setActiveTab(newTab);
    const newSection = migrateNavigationRoute(tabToSectionMap[newTab] || 'dashboard');
    setActiveSection(newSection);
    setSearchParams({
      tab: newTab
    });
    console.log('🔍 SUBSCRIBER DASHBOARD - Tab changed to:', newTab, 'Section:', newSection);
  };

  // Handle section change from figmant sidebar
  const handleSectionChange = (newSection: string) => {
    console.log('🔍 SUBSCRIBER DASHBOARD - Section change requested:', newSection);
    const migratedSection = migrateNavigationRoute(newSection);
    console.log('🔍 SUBSCRIBER DASHBOARD - Migrated section:', migratedSection);
    setActiveSection(migratedSection);
    
    // Set the first available tab for the section
    const sectionTabs = Object.entries(tabToSectionMap)
      .filter(([_, section]) => migrateNavigationRoute(section) === migratedSection)
      .map(([tab, _]) => tab);
    
    console.log('🔍 SUBSCRIBER DASHBOARD - Available tabs for section:', sectionTabs);
    
    if (sectionTabs.length > 0) {
      let firstTab = sectionTabs[0];
      if (migratedSection === 'dashboard') {
        // For dashboard, prefer 'design' first
        if (sectionTabs.includes('design')) {
          firstTab = 'design';
        } else if (sectionTabs.includes('all-analysis')) {
          firstTab = 'all-analysis';
        }
      } else if (migratedSection === 'competitor-analysis') {
        // For competitor analysis, prefer 'competitor-analysis' tab
        if (sectionTabs.includes('competitor-analysis')) {
          firstTab = 'competitor-analysis';
        }
      } else if (migratedSection === 'wizard-analysis') {
        // For wizard analysis, prefer 'wizard-analysis' tab
        if (sectionTabs.includes('wizard-analysis')) {
          firstTab = 'wizard-analysis';
        }
      }
      
      console.log('🔍 SUBSCRIBER DASHBOARD - Selected tab:', firstTab);
      setActiveTab(firstTab);
      setSearchParams({
        tab: firstTab
      });
    }
  };

  // Sync tab state with URL changes and handle invalid tabs
  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'design';
    console.log('🔍 SUBSCRIBER DASHBOARD - URL tab changed to:', currentTab);

    // If the current tab is invalid, redirect to default
    if (!validTabs.includes(currentTab)) {
      console.log('🔍 SUBSCRIBER DASHBOARD - Invalid tab detected, redirecting to design tab');
      setActiveTab('design');
      setActiveSection('dashboard');
      setSearchParams({
        tab: 'design'
      });
    } else {
      setActiveTab(currentTab);
      const newSection = migrateNavigationRoute(tabToSectionMap[currentTab] || 'dashboard');
      setActiveSection(newSection);
      console.log('🔍 SUBSCRIBER DASHBOARD - URL sync - Tab:', currentTab, 'Section:', newSection);
    }
  }, [searchParams, setSearchParams]);

  console.log('🔍 SUBSCRIBER DASHBOARD - Rendering with tab:', activeTab, 'section:', activeSection);
  
  return (
    <SubscriberDashboardErrorBoundary>
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
          
          {/* Secondary Navigation for subscriber tabs */}
          <div className="flex-none">
            <SubscriberSidebar
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
