
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useEnhancedChatContext } from '@/hooks/useEnhancedChatContext';
import { useEnhancedChatSessionContext } from '@/hooks/useEnhancedChatSessionContext';
import { useToast } from '@/hooks/use-toast';

// Unified conversation context interface to avoid conflicts
interface ChatStateConversationContext {
  currentMessages: ChatMessage[];
  historicalContext: string;
  attachmentContext: string[];
  tokenEstimate: number;
  sessionAttachments?: any[];
  sessionLinks?: any[];
  totalMessages?: number;
  sessionId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
    attachments?: number;
  }>;
}

interface AutoSaveState {
  status: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date;
  messageCount: number;
}

interface ChatStateContextType {
  // State
  messages: ChatMessage[];
  message: string;
  attachments: ChatAttachment[];
  selectedTemplateId?: string;
  currentSessionId?: string;
  currentSession: any;
  sessions: any[];
  sessionAttachments: ChatAttachment[];
  sessionLinks: ChatAttachment[];
  isSessionInitialized: boolean;
  
  // Enhanced Context
  conversationContext: ChatStateConversationContext;
  autoSaveState: AutoSaveState;
  isLoadingContext: boolean;
  
  // Mutations
  analyzeWithClaude: any;
  isAnalyzing: boolean;
  
  // Templates
  templates: any[];
  templatesLoading: boolean;
  
  // Actions - properly typed React setters
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>;
  setSelectedTemplateId?: (id: string) => void;
  startNewSession: () => void;
  loadSession: (sessionId: string) => void;
  saveMessageAttachments: (message: ChatMessage) => void;
  getCurrentTemplate: () => any;
  
  // Enhanced Context Actions
  triggerAutoSave: (messages: ChatMessage[]) => void;
  createContextualPrompt: (message: string, template?: any) => string;
  saveConversation: (messages: ChatMessage[]) => Promise<void>;
  loadHistoricalContext: (sessionId: string) => void;
  
  // Enhanced Message Handler - FIX FOR BUILD ERROR
  enhancedMessageHandler?: {
    handleAddUrl: (url: string) => Promise<void>;
    handleFileUpload: (files: FileList) => Promise<void>;
    handleSendMessage: () => Promise<void>;
  };
  
  toast: any;
}

const ChatStateContext = createContext<ChatStateContextType | null>(null);

export const useChatStateContext = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error('useChatStateContext must be used within ChatStateProvider');
  }
  return context;
};

// Add this alias for backward compatibility
export const useEnhancedChatStateContext = useChatStateContext;

interface ChatStateProviderProps {
  children: ReactNode;
}

export const ChatStateProvider: React.FC<ChatStateProviderProps> = ({ children }) => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysis();
  const { toast } = useToast();
  
  const chatState = useChatState();
  
  // Enhanced session management
  const { sessionContext, initializeSession } = useEnhancedChatSessionContext();
  
  // Enhanced chat context integration
  const {
    conversationContext,
    autoSaveState,
    isLoadingContext,
    triggerAutoSave,
    createContextualPrompt,
    saveConversation,
    loadHistoricalContext
  } = useEnhancedChatContext(chatState.currentSessionId || sessionContext.sessionId);
  
  // Initialize session on mount if needed
  React.useEffect(() => {
    if (!sessionContext.isInitialized && !chatState.currentSessionId) {
      initializeSession();
    }
  }, [sessionContext.isInitialized, chatState.currentSessionId, initializeSession]);
  
  if (!chatState.setAttachments || !chatState.setMessages || !chatState.setMessage) {
    console.error('🚨 CHAT STATE PROVIDER - Chat state functions not available!');
    throw new Error('Chat state not properly initialized');
  }

  const {
    messages = [],
    setMessages,
    message = '',
    setMessage,
    attachments = [],
    setAttachments,
    selectedTemplateId,
    setSelectedTemplateId,
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    startNewSession,
    loadSession,
    saveMessageAttachments
  } = chatState;

  const getCurrentTemplate = () => {
    return templates.find(t => t.id === selectedTemplateId) || null;
  };

  // Enhanced context integration - auto-save when messages change
  React.useEffect(() => {
    if (messages.length > 0 && (currentSessionId || sessionContext.sessionId)) {
      triggerAutoSave(messages);
    }
  }, [messages.length, currentSessionId, sessionContext.sessionId, triggerAutoSave]);

  // Enhanced conversation context with current session data
  const enhancedConversationContext: ChatStateConversationContext = {
    currentMessages: messages,
    historicalContext: conversationContext.historicalContext,
    attachmentContext: conversationContext.attachmentContext,
    tokenEstimate: conversationContext.tokenEstimate,
    sessionAttachments: conversationContext.sessionAttachments || [],
    sessionLinks: conversationContext.sessionLinks || [],
    totalMessages: Math.max(conversationContext.totalMessages || 0, messages.length),
    sessionId: currentSessionId || sessionContext.sessionId || conversationContext.sessionId,
    messages: conversationContext.messages || []
  };

  // Enhanced Message Handler Implementation - FIX FOR BUILD ERROR
  const enhancedMessageHandler = {
    handleAddUrl: async (url: string) => {
      console.log('🔗 Enhanced handler - Adding URL:', url);
      // Implement URL addition logic here
      // This should handle URL validation, screenshot capture, etc.
    },
    handleFileUpload: async (files: FileList) => {
      console.log('📁 Enhanced handler - Uploading files:', files.length);
      // Implement file upload logic here
      // This should handle file validation, upload to storage, etc.
    },
    handleSendMessage: async () => {
      console.log('🚀 Enhanced handler - Sending message');
      // Implement message sending logic here
      // This should handle Claude AI analysis, message saving, etc.
    }
  };

  const contextValue: ChatStateContextType = {
    // State
    messages,
    message,
    attachments,
    selectedTemplateId,
    currentSessionId: currentSessionId || sessionContext.sessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized: isSessionInitialized || sessionContext.isInitialized,
    
    // Enhanced Context
    conversationContext: enhancedConversationContext,
    autoSaveState,
    isLoadingContext,
    
    // Mutations
    analyzeWithClaude,
    isAnalyzing,
    
    // Templates
    templates,
    templatesLoading,
    
    // Actions - properly typed as React setters
    setMessages,
    setMessage,
    setAttachments,
    setSelectedTemplateId,
    startNewSession,
    loadSession,
    saveMessageAttachments,
    getCurrentTemplate,
    
    // Enhanced Context Actions
    triggerAutoSave,
    createContextualPrompt,
    saveConversation,
    loadHistoricalContext,
    
    // Enhanced Message Handler - FIX FOR BUILD ERROR
    enhancedMessageHandler,
    
    toast
  };

  return (
    <ChatStateContext.Provider value={contextValue}>
      {children}
    </ChatStateContext.Provider>
  );
};
