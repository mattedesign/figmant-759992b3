
import { tabMapping } from './tabs/tabMapping';
import { DesignAnalysisTab } from './tabs/DesignAnalysisTab';
import { CompetitorAnalysisPage } from '@/components/figmant/pages/analysis/CompetitorAnalysisPage';
import { PremiumAnalysisWizard } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisWizard';
import { PremiumAnalysisTabController } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisTabController';

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  console.log('🎯 OWNER TAB CONTENT RENDERER - activeTab received:', activeTab);
  
  // Handle competitor analysis route FIRST
  if (activeTab === 'competitor-analysis') {
    console.log('✅ OWNER TAB RENDERER - Loading CompetitorAnalysisPage for tab:', activeTab);
    return (
      <div className="h-full w-full">
        <CompetitorAnalysisPage />
      </div>
    );
  }

  if (activeTab === 'wizard-analysis') {
    console.log('✅ OWNER TAB RENDERER - Loading PremiumAnalysisWizard for tab:', activeTab);
    return (
      <div className="h-full w-full">
        <PremiumAnalysisWizard />
      </div>
    );
  }

  if (activeTab === 'premium-analysis') {
    console.log('✅ OWNER TAB RENDERER - Loading PremiumAnalysisTabController for tab:', activeTab);
    return (
      <div className="h-full w-full">
        <PremiumAnalysisTabController />
      </div>
    );
  }

  // Use existing tab mapping for other components
  const TabComponent = tabMapping[activeTab] || DesignAnalysisTab;
  console.log('🎯 OWNER TAB RENDERER - Using tabMapping for tab:', activeTab, 'Component:', TabComponent?.name || 'DesignAnalysisTab');

  return (
    <div className="h-full w-full">
      <TabComponent />
    </div>
  );
};
