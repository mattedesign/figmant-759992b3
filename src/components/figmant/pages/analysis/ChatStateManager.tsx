
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useLocation } from 'react-router-dom';
import { usePersistentChatSession } from '@/hooks/usePersistentChatSession';

interface UseChatStateProps {
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
}

export const useChatState = (props?: UseChatStateProps) => {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Template state
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('master');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('master');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('master');

  // Persistent session management
  const {
    currentSessionId,
    currentSession,
    sessions,
    saveMessageAttachments,
    sessionAttachments,
    sessionLinks,
    createNewSession,
    switchToSession,
    isSessionInitialized
  } = usePersistentChatSession();

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

  // Call onAttachmentsChange when attachments change
  useEffect(() => {
    if (props?.onAttachmentsChange) {
      props.onAttachmentsChange(attachments);
    }
  }, [attachments, props?.onAttachmentsChange]);

  const addMessage = useCallback((newMessage: ChatMessage) => {
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      
      // Save attachments for user messages
      if (newMessage.role === 'user' && isSessionInitialized) {
        saveMessageAttachments(newMessage);
      }
      
      return updatedMessages;
    });
  }, [saveMessageAttachments, isSessionInitialized]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setAttachments([]);
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

  const startNewSession = useCallback((sessionName?: string) => {
    // Clear current chat state
    clearMessages();
    
    // Create new persistent session
    createNewSession(sessionName);
  }, [clearMessages, createNewSession]);

  const loadSession = useCallback((sessionId: string) => {
    // Clear current messages and switch session
    clearMessages();
    switchToSession(sessionId);
    
    // Note: In a full implementation, you'd also load the message history
    // from the database here. For now, we're focusing on attachment persistence.
  }, [clearMessages, switchToSession]);

  return {
    // Message state
    messages,
    setMessages, // This is now properly typed as React.Dispatch<React.SetStateAction<ChatMessage[]>>
    message,
    setMessage, // This is now properly typed as React.Dispatch<React.SetStateAction<string>>
    attachments,
    setAttachments, // This is now properly typed as React.Dispatch<React.SetStateAction<ChatAttachment[]>>
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    isAnalyzing,
    setIsAnalyzing,
    
    // Template state
    selectedPromptCategory,
    setSelectedPromptCategory,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
    selectedTemplateId,
    setSelectedTemplateId,
    
    // Message operations
    addMessage,
    clearMessages,
    updateLastMessage,
    
    // Session state
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    
    // Session operations
    startNewSession,
    loadSession,
    saveMessageAttachments
  };
};
