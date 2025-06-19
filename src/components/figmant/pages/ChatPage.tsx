
import React from 'react';
import { UnifiedChatContainer } from './analysis/components/UnifiedChatContainer';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  console.log('💬 CHAT PAGE - Rendering unified chat system');

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0">
        <UnifiedChatContainer />
      </div>
    </div>
  );
};
