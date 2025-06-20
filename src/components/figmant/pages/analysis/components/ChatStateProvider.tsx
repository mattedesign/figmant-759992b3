
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
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
    
    // Mutations
    analyzeWithClaude,
    isAnalyzing,
    
    // Templates
    templates,
    templatesLoading,
    
    // Actions - now properly typed as React setters
    setMessages,
    setMessage,
    setAttachments,
    setSelectedTemplateId,
    startNewSession,
    loadSession,
    saveMessageAttachments,
    getCurrentTemplate,
    toast
  };

  return (
    <ChatStateContext.Provider value={contextValue}>
      {children}
    </ChatStateContext.Provider>
  );
};
