
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysisEnhanced } from '@/hooks/useFigmantChatAnalysisEnhanced';
import { useEnhancedChatContext } from '@/hooks/useEnhancedChatContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedChatStateContextType {
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
  
  // Enhanced context state
  conversationContext: any;
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
  toast: any;
}

const EnhancedChatStateContext = createContext<EnhancedChatStateContextType | null>(null);

export const useEnhancedChatStateContext = () => {
  const context = useContext(EnhancedChatStateContext);
  if (!context) {
    throw new Error('useEnhancedChatStateContext must be used within EnhancedChatStateProvider');
  }
  return context;
};

interface EnhancedChatStateProviderProps {
  children: ReactNode;
}

export const EnhancedChatStateProvider: React.FC<EnhancedChatStateProviderProps> = ({ children }) => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { toast } = useToast();
  
  const chatState = useChatState();
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

  // Enhanced context hooks
  const {
    conversationContext,
    isLoadingContext,
    loadHistoricalContext,
    saveMessageWithContext,
    createContextualPrompt,
    shouldCreateSummary,
    createConversationSummary
  } = useEnhancedChatContext(currentSessionId);

  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysisEnhanced(currentSessionId);

  // Load historical context when session changes
  useEffect(() => {
    if (currentSessionId && isSessionInitialized) {
      console.log('🔄 ENHANCED CHAT STATE - Loading context for session:', currentSessionId);
      loadHistoricalContext(currentSessionId);
    }
  }, [currentSessionId, isSessionInitialized, loadHistoricalContext]);

  // Auto-save messages to database
  useEffect(() => {
    const saveRecentMessages = async () => {
      if (!currentSessionId || !isSessionInitialized || messages.length === 0) return;

      try {
        // Save the last message if it hasn't been saved yet
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && !lastMessage.id.includes('saved-')) {
          console.log('💾 ENHANCED CHAT STATE - Auto-saving message:', lastMessage.id);
          
          await saveMessageWithContext(currentSessionId, lastMessage, messages.length);
          
          // Update message ID to indicate it's been saved
          setMessages(prev => prev.map(msg => 
            msg.id === lastMessage.id 
              ? { ...msg, id: `saved-${msg.id}` }
              : msg
          ));

          // Check if we should create a conversation summary
          if (shouldCreateSummary(messages)) {
            console.log('📝 ENHANCED CHAT STATE - Creating conversation summary...');
            await createConversationSummary(currentSessionId, messages);
            // Reload context after creating summary
            loadHistoricalContext(currentSessionId);
          }
        }
      } catch (error) {
        console.error('💾 ENHANCED CHAT STATE - Error auto-saving message:', error);
      }
    };

    // Debounce the save operation
    const timer = setTimeout(saveRecentMessages, 2000);
    return () => clearTimeout(timer);
  }, [messages, currentSessionId, isSessionInitialized, saveMessageWithContext, shouldCreateSummary, createConversationSummary, loadHistoricalContext, setMessages]);

  const getCurrentTemplate = () => {
    return templates.find(t => t.id === selectedTemplateId) || null;
  };

  const contextValue: EnhancedChatStateContextType = {
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
    
    // Enhanced context state
    conversationContext,
    isLoadingContext,
    
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
    <EnhancedChatStateContext.Provider value={contextValue}>
      {children}
    </EnhancedChatStateContext.Provider>
  );
};
