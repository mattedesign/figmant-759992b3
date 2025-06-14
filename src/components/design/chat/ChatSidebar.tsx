
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
  // Get the last analysis result from messages
  const lastAnalysisResult = messages
    .filter(msg => msg.role === 'assistant')
    .slice(-1)[0]?.content || null;

  return (
    <div className="space-y-6">
      <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
      
      {messages.length > 0 && lastAnalysisResult && (
        <AnalysisResults 
          lastAnalysisResult={{ analysis: lastAnalysisResult }}
          uploadIds={messages.slice(-1)[0]?.uploadIds}
        />
      )}
    </div>
  );
};
