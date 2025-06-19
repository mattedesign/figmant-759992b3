
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useLocation } from 'react-router-dom';

export const useChatState = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load historical analysis if provided in navigation state
  useEffect(() => {
    if (location.state?.loadHistoricalAnalysis && location.state?.historicalData) {
      const historicalData = location.state.historicalData;
      
      // Create messages from historical data
      const historicalMessages: ChatMessage[] = [];
      
      if (historicalData.type === 'chat') {
        // For chat analysis, reconstruct the conversation
        historicalMessages.push({
          id: `historical-user-${historicalData.id}`,
          content: historicalData.prompt_used,
          role: 'user',
          timestamp: new Date(historicalData.created_at),
        });
        
        historicalMessages.push({
          id: `historical-assistant-${historicalData.id}`,
          content: historicalData.analysis_results?.response || 'Analysis completed',
          role: 'assistant',
          timestamp: new Date(historicalData.created_at),
        });
      } else {
        // For design analysis, show the analysis context
        historicalMessages.push({
          id: `historical-context-${historicalData.id}`,
          content: `Previous Analysis Context:\n\nFile: ${historicalData.title}\nAnalysis Type: ${historicalData.analysisType}\nScore: ${historicalData.score}/10\n\nYou can continue the conversation based on this analysis.`,
          role: 'assistant',
          timestamp: new Date(historicalData.created_at),
        });
      }
      
      setMessages(historicalMessages);
    }
  }, [location.state]);

  const addMessage = useCallback((newMessage: ChatMessage) => {
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content
        };
      }
      return updated;
    });
  }, []);

  return {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    isAnalyzing,
    setIsAnalyzing,
    addMessage,
    clearMessages,
    updateLastMessage
  };
};
