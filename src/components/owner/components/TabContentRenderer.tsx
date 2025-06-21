
import { tabMapping } from './tabs/tabMapping';
import { DesignAnalysisTab } from './tabs/DesignAnalysisTab';
import { PremiumAnalysisWizard } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisWizard';
import { PremiumAnalysisTabController } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisTabController';
import { CompetitorAnalysisPage } from '@/components/figmant/pages/analysis/CompetitorAnalysisPage';

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  // Handle specific analysis routes directly
  if (activeTab === 'competitor-analysis') {
    return (
      <div className="h-full w-full">
        <CompetitorAnalysisPage />
      </div>
    );
  }

  if (activeTab === 'wizard-analysis') {
    return (
      <div className="h-full w-full">
        <PremiumAnalysisWizard />
      </div>
    );
  }

  if (activeTab === 'premium-analysis') {
    return (
      <div className="h-full w-full">
        <PremiumAnalysisTabController />
      </div>
    );
  }

  // Use existing tab mapping for other components
  const TabComponent = tabMapping[activeTab] || DesignAnalysisTab;

  return (
    <div className="h-full w-full">
      <TabComponent />
    </div>
  );
};
