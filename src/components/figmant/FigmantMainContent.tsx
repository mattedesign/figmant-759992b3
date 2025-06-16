
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisDetailView } from '@/components/design/analysis/AnalysisDetailView';
import { DesignChatInterface } from '@/components/design/DesignChatInterface';
import { DashboardPage } from './pages/DashboardPage';
import { CreditsPage } from './pages/CreditsPage';
import { PremiumAnalysisPage } from './pages/PremiumAnalysisPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { SearchPage } from './pages/SearchPage';

interface FigmantMainContentProps {
  activeSection: string;
  selectedAnalysis: any;
  onBackToList: () => void;
  onRightSidebarModeChange: (mode: string) => void;
}

export const FigmantMainContent: React.FC<FigmantMainContentProps> = ({
  activeSection,
  selectedAnalysis,
  onBackToList,
  onRightSidebarModeChange
}) => {
  const [activeTab, setActiveTab] = useState('chat');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update right sidebar mode based on active tab
    if (tab === 'chat') {
      onRightSidebarModeChange('attachments');
    } else {
      onRightSidebarModeChange('preview');
    }
  };

  const renderAnalysisContent = () => {
    if (selectedAnalysis) {
      return (
        <AnalysisDetailView 
          analysis={selectedAnalysis}
          onBack={onBackToList}
        />
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-48 grid-cols-2 bg-gray-100">
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="prompts" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Prompts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <div className="flex-1 overflow-hidden">
                <DesignChatInterface />
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="flex-1 flex flex-col m-0">
              <div className="flex-1 p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Design Analysis</h2>
                    <p className="text-gray-600 mb-8">Start with a task, and let Figmant complete it for you. Not sure where to start? Try a template.</p>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                      <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 text-left">
                        <span className="text-sm font-medium">✏️ Generate a resume</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 text-left">
                        <span className="text-sm font-medium">🌐 Make me a landing page</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 text-left">
                        <span className="text-sm font-medium">🎨 Draw cat face sketch</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 text-left">
                        <span className="text-sm font-medium">🧮 Create math question</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;

      case 'analysis':
        return renderAnalysisContent();

      case 'premium-analysis':
        return <PremiumAnalysisPage />;

      case 'credits':
        return <CreditsPage />;

      case 'templates':
        return <TemplatesPage />;

      case 'preferences':
        return <PreferencesPage />;

      case 'search':
        return <SearchPage />;

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Figmant</h2>
              <p className="text-gray-600">
                Select a section from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {renderContent()}
    </div>
  );
};
