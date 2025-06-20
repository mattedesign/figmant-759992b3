
import React from 'react';
import { DesignChatInterface } from '@/components/design/DesignChatInterface';
import { useCompetitorChatHandler } from './hooks/useCompetitorChatHandler';

export const CompetitorAnalysisPage: React.FC = () => {
  const {
    messages,
    message,
    setMessage,
    attachments,
    setAttachments,
    isAnalyzing,
    handleSendMessage,
    handleKeyPress,
    canSend
  } = useCompetitorChatHandler();

  const handleOnSendMessage = (msg: string, attachments: any[]) => {
    console.log('🔥 COMPETITOR - OnSendMessage called with:', { msg, attachments });
    // The actual sending is handled by the hook's handleSendMessage
    handleSendMessage();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
        <p className="text-gray-600 mt-1">Analyze competitor designs and identify opportunities</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <DesignChatInterface
          messages={messages}
          isProcessing={isAnalyzing}
          placeholder="Enter competitor URLs or ask about competitive analysis..."
          onSendMessage={handleOnSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
