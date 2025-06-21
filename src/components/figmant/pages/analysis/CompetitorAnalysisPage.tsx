
import React from 'react';
import { DesignChatInterface } from '@/components/design/DesignChatInterface';
import { useCompetitorChatHandler } from './hooks/useCompetitorChatHandler';
import { AnalysisLoadingIndicator } from './components/AnalysisLoadingIndicator';
import { UpgradeSuggestion } from './components/UpgradeSuggestion';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

export const CompetitorAnalysisPage: React.FC = () => {
  const {
    messages,
    message,
    setMessage,
    attachments,
    setAttachments,
    isAnalyzing,
    analysisStage,
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
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Quick Analysis</h1>
        </div>
        <p className="text-gray-600 mt-1">Analyze competitor designs and identify opportunities</p>
      </div>
      
      {/* Enhanced Loading State */}
      <AnalysisLoadingIndicator 
        stage={analysisStage}
        isVisible={isAnalyzing}
        className="mx-4 mt-4 mb-2"
      />
      
      {/* Upgrade Suggestion */}
      <UpgradeSuggestion className="mx-4 mt-4" />
      
      <div className="flex-1 min-h-0">
        <DesignChatInterface
          messages={messages}
          isProcessing={isAnalyzing}
          placeholder="Enter competitor URLs or ask about competitive analysis..."
          onSendMessage={handleOnSendMessage}
          className="h-full"
        />
      </div>
      
      {/* Enhanced Status Footer */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {canSend ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">Ready to analyze</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-amber-700">
                  {isAnalyzing ? 'Analysis in progress...' : 'Enter message or attach URLs'}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Messages: {messages.length}</span>
            {isAnalyzing && (
              <span className="text-blue-600 font-medium">
                Processing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
