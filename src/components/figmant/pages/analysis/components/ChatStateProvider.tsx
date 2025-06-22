
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useEnhancedChatContext } from '@/hooks/useEnhancedChatContext';
import { useToast } from '@/hooks/use-toast';

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
  conversationContext: any;
  autoSaveState: any;
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

interface ChatStateProviderProps {
  children: ReactNode;
}

export const ChatStateProvider: React.FC<ChatStateProviderProps> = ({ children }) => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysis();
  const { toast } = useToast();
  
  const chatState = useChatState();
  
  // Enhanced chat context integration
  const {
    conversationContext,
    autoSaveState,
    isLoadingContext,
    triggerAutoSave,
    createContextualPrompt,
    saveConversation
  } = useEnhancedChatContext(chatState.currentSessionId);
  
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
    if (messages.length > 0 && currentSessionId) {
      triggerAutoSave(messages);
    }
  }, [messages.length, currentSessionId, triggerAutoSave]);

  // Update conversation context with current messages
  React.useEffect(() => {
    if (currentSessionId && conversationContext.sessionId === currentSessionId) {
      // Update the conversation context with current messages for real-time context
      conversationContext.currentMessages = messages;
      conversationContext.totalMessages = Math.max(conversationContext.totalMessages, messages.length);
    }
  }, [messages, currentSessionId, conversationContext]);

  const contextValue: ChatStateContextType = {
    // State
    messages,
    message,
    attachments,
    selectedTemplateId,
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    
    // Enhanced Context
    conversationContext,
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
    
    toast
  };

  return (
    <ChatStateContext.Provider value={contextValue}>
      {children}
    </ChatStateContext.Provider>
  );
};
