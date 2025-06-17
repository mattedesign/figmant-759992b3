
import React, { useState } from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisDetailsPanel } from './components/AnalysisDetailsPanel';
import { ChatAttachment, ChatMessage } from '@/components/design/DesignChatInterface';

interface AnalysisPageContainerProps {
  // Add any props needed from parent components
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  const handleAnalysisDetailsUpdate = (messagesExist: boolean) => {
    setHasMessages(messagesExist);
  };

  const handleAnalysisComplete = (result: any) => {
    setCurrentAnalysis(result);
  };

  return (
    <div className="flex h-full">
      {/* Main chat panel */}
      <div className="flex-1">
        <AnalysisChatPanel
          message={message}
          setMessage={setMessage}
          messages={messages}
          setMessages={setMessages}
          attachments={attachments}
          setAttachments={setAttachments}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          showUrlInput={showUrlInput}
          setShowUrlInput={setShowUrlInput}
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisDetailsUpdate={handleAnalysisDetailsUpdate}
        />
      </div>
      
      {/* Analysis details panel */}
      <div className="w-80">
        <AnalysisDetailsPanel
          currentAnalysis={currentAnalysis}
          attachments={attachments}
          hasMessages={hasMessages}
        />
      </div>
    </div>
  );
};
