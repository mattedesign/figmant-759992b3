
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Paperclip } from 'lucide-react';

interface AnalysisChatTabsProps {
  activeTab: 'chat' | 'attachments';
  onTabChange: (tab: 'chat' | 'attachments') => void;
  attachmentCount?: number;
}

export const AnalysisChatTabs: React.FC<AnalysisChatTabsProps> = ({
  activeTab,
  onTabChange,
  attachmentCount = 0
}) => {
  return (
    <div className="px-6 pt-4">
      <div className="flex space-x-1">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('chat')}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Button>
        
        <Button
          variant={activeTab === 'attachments' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('attachments')}
          className="flex items-center gap-2"
        >
          <Paperclip className="h-4 w-4" />
          Attachments
          {attachmentCount > 0 && (
            <span className="ml-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {attachmentCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
