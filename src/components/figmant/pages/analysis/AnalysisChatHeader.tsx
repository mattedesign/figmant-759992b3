
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
  const handleTabChange = (value: string) => {
    console.log('AnalysisChatHeader: Tab change requested:', value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2"
            disabled={false}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="wizard" 
            className="flex items-center gap-2"
            disabled={false}
          >
            <Sparkles className="h-4 w-4" />
            Wizard
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
