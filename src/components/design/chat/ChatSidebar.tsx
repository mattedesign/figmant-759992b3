
import React from 'react';
import { SuggestedPrompts } from './SuggestedPrompts';
import { MobileSuggestedPrompts } from './MobileSuggestedPrompts';
import { AnalysisResults } from './AnalysisResults';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatMessage } from '@/components/design/DesignChatInterface';

interface ChatSidebarProps {
  messages: ChatMessage[];
  onSelectPrompt: (prompt: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  onSelectPrompt
}) => {
  const isMobile = useIsMobile();
  
  // Get the last analysis result from messages
  const lastAnalysisResult = messages
    .filter(msg => msg.role === 'assistant')
    .slice(-1)[0]?.content || null;

  const PromptsComponent = isMobile ? MobileSuggestedPrompts : SuggestedPrompts;

  return (
    <div className="space-y-6">
      <PromptsComponent onSelectPrompt={onSelectPrompt} />
      
      {messages.length > 0 && lastAnalysisResult && (
        <AnalysisResults 
          lastAnalysisResult={{ analysis: lastAnalysisResult }}
          uploadIds={messages.slice(-1)[0]?.uploadIds}
        />
      )}
    </div>
  );
};
