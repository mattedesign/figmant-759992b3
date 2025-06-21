
import { tabMapping } from './tabs/tabMapping';
import { DesignAnalysisTab } from './tabs/DesignAnalysisTab';
import { CompetitorAnalysisPage } from '@/components/figmant/pages/analysis/CompetitorAnalysisPage';
import { PremiumAnalysisWizard } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisWizard';
import { PremiumAnalysisTabController } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisTabController';
import { SystemStatusMonitor } from '@/components/analysis/SystemStatusMonitor';

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  console.log('🎯 OWNER TAB CONTENT RENDERER - activeTab received:', activeTab);
  
  // Handle competitor analysis route FIRST
  if (activeTab === 'competitor-analysis') {
    console.log('✅ OWNER TAB RENDERER - Loading CompetitorAnalysisPage for tab:', activeTab);
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex-none p-4 border-b">
          <SystemStatusMonitor showDetails={false} autoRefresh={true} />
        </div>
        <div className="flex-1">
          <CompetitorAnalysisPage />
        </div>
      </div>
    );
  }

  if (activeTab === 'wizard-analysis') {
    console.log('✅ OWNER TAB RENDERER - Loading PremiumAnalysisWizard for tab:', activeTab);
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex-none p-4 border-b">
          <SystemStatusMonitor showDetails={false} autoRefresh={true} />
        </div>
        <div className="flex-1">
          <PremiumAnalysisWizard />
        </div>
      </div>
    );
  }

  if (activeTab === 'premium-analysis') {
    console.log('✅ OWNER TAB RENDERER - Loading PremiumAnalysisTabController for tab:', activeTab);
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex-none p-4 border-b">
          <SystemStatusMonitor showDetails={false} autoRefresh={true} />
        </div>
        <div className="flex-1">
          <PremiumAnalysisTabController />
        </div>
      </div>
    );
  }

  // Use existing tab mapping for other components
  const TabComponent = tabMapping[activeTab] || DesignAnalysisTab;
  console.log('🎯 OWNER TAB RENDERER - Using tabMapping for tab:', activeTab, 'Component:', TabComponent?.name || 'DesignAnalysisTab');

  return (
    <div className="h-full w-full flex flex-col">
      {/* Show system status for analysis-related tabs */}
      {(activeTab === 'design' || activeTab === 'all-analysis' || activeTab === 'batch' || activeTab === 'history') && (
        <div className="flex-none p-4 border-b">
          <SystemStatusMonitor showDetails={false} autoRefresh={true} />
        </div>
      )}
      <div className="flex-1">
        <TabComponent />
      </div>
    </div>
  );
};
