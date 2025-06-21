
import { tabMapping } from './tabs/tabMapping';
import { DesignAnalysisTab } from './tabs/DesignAnalysisTab';
import { PremiumAnalysisWizard } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisWizard';
import { PremiumAnalysisTabController } from '@/components/figmant/pages/premium-analysis/PremiumAnalysisTabController';

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  // Handle specific wizard and premium analysis routes directly
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
