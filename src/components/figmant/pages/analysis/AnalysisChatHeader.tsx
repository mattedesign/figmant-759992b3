
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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Design Analysis</h1>
        <p className="text-gray-600 mt-1">Get AI-powered insights on your designs</p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Analysis
          </TabsTrigger>
          <TabsTrigger value="wizard" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Analysis Wizard
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
