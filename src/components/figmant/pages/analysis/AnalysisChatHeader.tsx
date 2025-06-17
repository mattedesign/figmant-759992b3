
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Sparkles } from 'lucide-react';

interface AnalysisChatHeaderProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const AnalysisChatHeader: React.FC<AnalysisChatHeaderProps> = ({
  activeTab = "chat",
  onTabChange
}) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="wizard" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Wizard
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
