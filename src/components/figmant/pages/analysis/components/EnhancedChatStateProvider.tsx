
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useEnhancedChatContext } from '@/hooks/useEnhancedChatContext';
import { useEnhancedChatSessionContext } from '@/hooks/useEnhancedChatSessionContext';
import { useFigmantChatAnalysisEnhanced } from '@/hooks/useFigmantChatAnalysisEnhanced';
import { useToast } from '@/hooks/use-toast';

interface ConversationContext {
  currentMessages: ChatMessage[];
  historicalContext: string;
  attachmentContext: string[];
  tokenEstimate: number;
  sessionAttachments?: any[];
  sessionLinks?: any[];
  totalMessages?: number;
}

interface EnhancedChatState {
  // Core state
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  attachments: ChatAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>;
  showUrlInput: boolean;
  setShowUrlInput: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Enhanced context
  conversationContext: ConversationContext;
  
  // Session management
  currentSessionId?: string;
  isSessionInitialized: boolean;
  
  // Analysis capabilities
  analyzeWithClaude: (params: any) => Promise<any>;
  getCurrentTemplate: () => any;
  saveMessageAttachments: (message: ChatMessage) => void;
  
  // Toast for notifications
  toast: any;
}

const EnhancedChatStateContext = createContext<EnhancedChatState | undefined>(undefined);

export const useEnhancedChatStateContext = () => {
  const context = useContext(EnhancedChatStateContext);
  if (!context) {
    throw new Error('useEnhancedChatStateContext must be used within EnhancedChatStateProvider');
  }
  return context;
};

interface EnhancedChatStateProviderProps {
  children: React.ReactNode;
}

export const EnhancedChatStateProvider: React.FC<EnhancedChatStateProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { toast } = useToast();

  // Enhanced context and session management
  const { sessionContext, initializeSession } = useEnhancedChatSessionContext();
  const { 
    conversationContext, 
    loadHistoricalContext, 
    createContextualPrompt 
  } = useEnhancedChatContext(sessionContext.sessionId);
  
  const { mutateAsync: analyzeWithClaudeAsync } = useFigmantChatAnalysisEnhanced(sessionContext.sessionId);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionContext.isInitialized) {
      initializeSession();
    }
  }, [sessionContext.isInitialized, initializeSession]);

  // Load historical context when session is ready
  useEffect(() => {
    if (sessionContext.sessionId && sessionContext.isInitialized) {
      loadHistoricalContext(sessionContext.sessionId);
    }
  }, [sessionContext.sessionId, sessionContext.isInitialized, loadHistoricalContext]);

  const analyzeWithClaude = useCallback(async (params: any) => {
    return await analyzeWithClaudeAsync(params);
  }, [analyzeWithClaudeAsync]);

  const getCurrentTemplate = useCallback(() => {
    // Return default template or selected template
    return {
      id: 'master',
      content: 'Analyze this design and provide comprehensive feedback.'
    };
  }, []);

  const saveMessageAttachments = useCallback((message: ChatMessage) => {
    console.log('Saving message attachments:', message);
    // Implementation will be connected to the session service
  }, []);

  const contextValue: EnhancedChatState = {
    // Core state
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    showUrlInput,
    setShowUrlInput,
    
    // Enhanced context with enhanced structure
    conversationContext: {
      currentMessages: conversationContext.currentMessages,
      historicalContext: conversationContext.historicalContext,
      attachmentContext: conversationContext.attachmentContext,
      tokenEstimate: conversationContext.tokenEstimate,
      sessionAttachments: [],
      sessionLinks: [],
      totalMessages: conversationContext.currentMessages.length
    },
    
    // Session management
    currentSessionId: sessionContext.sessionId,
    isSessionInitialized: sessionContext.isInitialized,
    
    // Analysis capabilities
    analyzeWithClaude,
    getCurrentTemplate,
    saveMessageAttachments,
    
    // Toast for notifications
    toast
  };

  return (
    <EnhancedChatStateContext.Provider value={contextValue}>
      {children}
    </EnhancedChatStateContext.Provider>
  );
};
