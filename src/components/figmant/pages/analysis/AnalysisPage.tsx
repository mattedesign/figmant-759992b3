
import React, { useState, useEffect } from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { useChatState } from './ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';

export const AnalysisPage: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const chatState = useChatState();
  const { resetCreditCost } = useTemplateCreditStore();

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

  return (
    <div className="h-full flex flex-col">
      {/* Debug Toggle Button */}
      <div className="p-2 border-b border-gray-200 bg-gray-50">
        <Button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          {showDebugPanel ? 'Hide' : 'Show'} Debug Info
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Main Chat Panel */}
        <div className={`${showDebugPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <AnalysisChatPanel
            message={chatState.message}
            setMessage={chatState.setMessage}
            messages={chatState.messages}
            setMessages={chatState.setMessages}
            attachments={chatState.attachments}
            setAttachments={chatState.setAttachments}
            urlInput={chatState.urlInput}
            setUrlInput={chatState.setUrlInput}
            showUrlInput={chatState.showUrlInput}
            setShowUrlInput={chatState.setShowUrlInput}
          />
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <UserDebugPanel />
          </div>
        )}
      </div>
    </div>
  );
};
