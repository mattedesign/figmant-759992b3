
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysisEnhanced } from '@/hooks/useFigmantChatAnalysisEnhanced';
import { useEnhancedChatContext } from '@/hooks/useEnhancedChatContext';
import { useEnhancedChatSessionContext } from '@/hooks/useEnhancedChatSessionContext';
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
  
  // Enhanced session context
  const {
    sessionContext,
    isLoading: sessionLoading,
    initializeSession,
    loadSession: loadExistingSession,
    updateSessionActivity
  } = useEnhancedChatSessionContext();

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
    sessions,
    sessionAttachments,
    sessionLinks,
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
  } = useEnhancedChatContext(sessionContext.sessionId);

  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysisEnhanced(sessionContext.sessionId);

  // Initialize session on mount if not already initialized
  useEffect(() => {
    if (!sessionContext.isInitialized && !sessionLoading) {
      console.log('🔄 ENHANCED CHAT STATE - Initializing new session...');
      initializeSession('Enhanced Chat Session');
    }
  }, [sessionContext.isInitialized, sessionLoading, initializeSession]);

  // Load historical context when session is ready
  useEffect(() => {
    if (sessionContext.sessionId && sessionContext.isInitialized) {
      console.log('🔄 ENHANCED CHAT STATE - Loading context for session:', sessionContext.sessionId);
      loadHistoricalContext(sessionContext.sessionId);
    }
  }, [sessionContext.sessionId, sessionContext.isInitialized, loadHistoricalContext]);

  // Auto-save messages to database with enhanced context
  useEffect(() => {
    const saveRecentMessages = async () => {
      if (!sessionContext.sessionId || !sessionContext.isInitialized || messages.length === 0) return;

      try {
        // Save the last message if it hasn't been saved yet
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && !lastMessage.id.includes('saved-')) {
          console.log('💾 ENHANCED CHAT STATE - Auto-saving message with context:', lastMessage.id);
          
          await saveMessageWithContext(sessionContext.sessionId, lastMessage, messages.length);
          
          // Update session activity
          updateSessionActivity();
          
          // Update message ID to indicate it's been saved
          setMessages(prev => prev.map(msg => 
            msg.id === lastMessage.id 
              ? { ...msg, id: `saved-${msg.id}` }
              : msg
          ));

          // Check if we should create a conversation summary
          if (shouldCreateSummary(messages)) {
            console.log('📝 ENHANCED CHAT STATE - Creating conversation summary...');
            await createConversationSummary(sessionContext.sessionId, messages);
            // Reload context after creating summary
            loadHistoricalContext(sessionContext.sessionId);
          }
        }
      } catch (error) {
        console.error('💾 ENHANCED CHAT STATE - Error auto-saving message:', error);
      }
    };

    // Debounce the save operation
    const timer = setTimeout(saveRecentMessages, 2000);
    return () => clearTimeout(timer);
  }, [messages, sessionContext.sessionId, sessionContext.isInitialized, saveMessageWithContext, shouldCreateSummary, createConversationSummary, loadHistoricalContext, setMessages, updateSessionActivity]);

  const getCurrentTemplate = () => {
    return templates.find(t => t.id === selectedTemplateId) || null;
  };

  const startNewSession = async () => {
    console.log('🆕 ENHANCED CHAT STATE - Starting new session...');
    setMessages([]);
    setAttachments([]);
    await initializeSession('New Enhanced Chat Session');
  };

  const loadSession = async (sessionId: string) => {
    console.log('📂 ENHANCED CHAT STATE - Loading session:', sessionId);
    setMessages([]);
    setAttachments([]);
    await loadExistingSession(sessionId);
  };

  const contextValue: EnhancedChatStateContextType = {
    // State
    messages,
    message,
    attachments,
    selectedTemplateId,
    currentSessionId: sessionContext.sessionId,
    currentSession: sessionContext,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized: sessionContext.isInitialized,
    
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
