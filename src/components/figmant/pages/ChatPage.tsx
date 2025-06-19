
import React from 'react';
import { UnifiedChatContainer } from './analysis/components/UnifiedChatContainer';
import { AnalysisNavigationSidebar } from './analysis/components/AnalysisNavigationSidebar';
import { useChatState } from './analysis/ChatStateManager';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  const chatState = useChatState();

  console.log('💬 CHAT ANALYSIS PAGE - Rendering chat analysis system');

  const handleViewAttachment = (attachment: any) => {
    console.log('View attachment:', attachment);
    // Could open a modal or preview
  };

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

      {/* Main Content with Sidebar */}
      <div className="flex-1 min-h-0 flex gap-4 px-6">
        {/* Main Chat Content */}
        <div className="flex-1 min-h-0">
          <UnifiedChatContainer />
        </div>

        {/* Right Navigation Sidebar */}
        <div className="flex-shrink-0">
          <AnalysisNavigationSidebar
            messages={chatState.messages || []}
            attachments={chatState.attachments || []}
            onRemoveAttachment={chatState.setAttachments ? (id) => {
              chatState.setAttachments(prev => prev.filter(att => att.id !== id));
            } : () => {}}
            onViewAttachment={handleViewAttachment}
            lastAnalysisResult={null}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
