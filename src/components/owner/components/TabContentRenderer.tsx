
import { tabMapping } from './tabs/tabMapping';
import { DesignAnalysisTab } from './tabs/DesignAnalysisTab';

interface TabContentRendererProps {
  activeTab: string;
}

export const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  // Handle specific wizard analysis routes directly
  if (activeTab === 'wizard-analysis') {
    return (
      <div className="h-full w-full p-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Wizard Analysis</h2>
          <p className="text-gray-600">
            Wizard analysis functionality is currently being restructured. Please use the design analysis tab for now.
          </p>
        </div>
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
