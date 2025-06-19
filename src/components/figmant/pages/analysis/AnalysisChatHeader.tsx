
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Wand2 } from 'lucide-react';

interface AnalysisChatHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AnalysisChatHeader: React.FC<AnalysisChatHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Design Analysis</h1>
        <p className="text-gray-600 mt-1">Analyze your designs with AI-powered insights</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="wizard" className="flex items-center space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>Guided Wizard</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
