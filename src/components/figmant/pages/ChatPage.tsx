
import React from 'react';
import { UnifiedChatContainer } from './analysis/components/UnifiedChatContainer';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  console.log('💬 CHAT ANALYSIS PAGE - Rendering chat analysis system');

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat Analysis</h1>
            <p className="text-gray-600 mt-1">Interactive AI-powered design analysis</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <UnifiedChatContainer />
      </div>
    </div>
  );
};
