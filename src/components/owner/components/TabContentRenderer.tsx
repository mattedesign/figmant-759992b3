
import { tabMapping } from './tabs/tabMapping';
import { DesignAnalysisTab } from './tabs/DesignAnalysisTab';

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  const TabComponent = tabMapping[activeTab] || DesignAnalysisTab;

  return (
    <div className="h-full w-full">
      <TabComponent />
    </div>
  );
};
