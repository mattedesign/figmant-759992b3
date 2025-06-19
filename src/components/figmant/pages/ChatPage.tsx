
import React from 'react';
import { UnifiedChatContainer } from './analysis/components/UnifiedChatContainer';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  console.log('💬 CHAT ANALYSIS PAGE - Rendering chat analysis system');

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Main Chat Content - Full width since Analysis Assets panel is now at layout level */}
      <div className="flex-1 min-h-0 px-6">
        <UnifiedChatContainer />
      </div>
    </div>
  );
};
