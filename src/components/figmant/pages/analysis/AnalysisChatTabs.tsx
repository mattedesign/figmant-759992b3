
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare,
  Paperclip
} from 'lucide-react';

interface AnalysisChatTabsProps {
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AnalysisChatTabs: React.FC<AnalysisChatTabsProps> = ({
  showUrlInput,
  setShowUrlInput,
  onFileSelect
}) => {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList 
        className="grid w-full grid-cols-2"
        style={{
          borderRadius: '8px',
          background: 'var(--action-background-neutral-light_active, rgba(28, 34, 43, 0.05))'
        }}
      >
        <TabsTrigger 
          value="chat"
          style={{
            borderRadius: '6px',
            background: 'var(--Background-primary, #FFF)',
            boxShadow: '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)'
          }}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </TabsTrigger>
        <TabsTrigger 
          value="attachments"
          style={{
            borderRadius: '6px'
          }}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Attachments
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
