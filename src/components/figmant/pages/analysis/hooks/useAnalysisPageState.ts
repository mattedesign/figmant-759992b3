
import { useState } from 'react';
import { useChatState } from '../ChatStateManager';

export const useAnalysisPageState = () => {
  const chatState = useChatState({
    onAttachmentsChange: (newAttachments) => {
      console.log('Attachments updated in chat state:', newAttachments);
    }
  });

  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  const handleAnalysisComplete = (result: any) => {
    setLastAnalysisResult(result);
    console.log('Analysis completed:', result);
  };

  const handleRemoveAttachment = (id: string) => {
    chatState.setAttachments(chatState.attachments.filter(att => att.id !== id));
  };

  return {
    ...chatState,
    lastAnalysisResult,
    setLastAnalysisResult,
    isRightPanelCollapsed,
    setIsRightPanelCollapsed,
    handleAnalysisComplete,
    handleRemoveAttachment
  };
};
