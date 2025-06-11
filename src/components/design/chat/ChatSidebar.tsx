
import React from 'react';
import { SuggestedPrompts } from './SuggestedPrompts';
import { AnalysisResults } from './AnalysisResults';
import { ChatMessage } from '@/components/design/DesignChatInterface';

interface ChatSidebarProps {
  messages: ChatMessage[];
  onSelectPrompt: (prompt: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  onSelectPrompt
}) => {
  return (
    <div className="space-y-6">
      <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
      
      {messages.length > 0 && (
        <AnalysisResults />
      )}
    </div>
  );
};
