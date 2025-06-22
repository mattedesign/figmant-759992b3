
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { ChatSessionService } from '@/services/chatSessionService';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';

interface ConversationContext {
  sessionId: string;
  currentMessages: ChatMessage[];
  historicalContext: string;
  attachmentContext: string[];
  tokenEstimate: number;
  lastSummaryAt?: Date;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
    attachments?: number;
  }>;
  totalMessages: number;
  sessionAttachments?: any[];
  sessionLinks?: any[];
}

interface AutoSaveState {
  status: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date;
  messageCount: number;
}

export const useEnhancedChatContext = (sessionId?: string) => {
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    sessionId: sessionId || '',
    currentMessages: [],
    historicalContext: '',
    attachmentContext: [],
    tokenEstimate: 0,
    messages: [],
    totalMessages: 0,
    sessionAttachments: [],
    sessionLinks: []
  });
  
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    status: 'idle',
    messageCount: 0
  });

  const { toast } = useToast();

  // Query to load conversation context
  const { data: contextData, isLoading: isLoadingContext, refetch: refetchContext } = useQuery({
    queryKey: ['conversation-context', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      console.log('🔄 ENHANCED CHAT CONTEXT - Loading context for session:', sessionId);
      return await ChatSessionService.getConversationSummary(sessionId);
    },
    enabled: !!sessionId,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (messages: ChatMessage[]) => {
      if (!sessionId || messages.length === 0) return;
      
      console.log('💾 ENHANCED CHAT CONTEXT - Auto-saving conversation:', {
        sessionId,
        messageCount: messages.length
      });

      await ChatSessionService.saveConversationContext(sessionId, messages, 'auto_save');
      
      // Create summary if needed
      if (shouldCreateSummary(messages)) {
        await createConversationSummary(sessionId, messages);
      }
    },
    onMutate: () => {
      setAutoSaveState(prev => ({ ...prev, status: 'saving' }));
    },
    onSuccess: () => {
      setAutoSaveState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: new Date()
      }));
      
      // Refetch context to get updated data
      refetchContext();
    },
    onError: (error) => {
      console.error('❌ ENHANCED CHAT CONTEXT - Auto-save failed:', error);
      setAutoSaveState(prev => ({ ...prev, status: 'error' }));
      
      toast({
        variant: "destructive",
        title: "Auto-save Failed",
        description: "Your conversation couldn't be saved automatically. Manual save recommended.",
      });
    }
  });

  // Update conversation context when data loads
  useEffect(() => {
    if (contextData && sessionId) {
      console.log('✅ ENHANCED CHAT CONTEXT - Context loaded:', {
        sessionId: contextData.sessionId,
        totalMessages: contextData.totalMessages,
        attachments: contextData.sessionAttachments?.length || 0,
        links: contextData.sessionLinks?.length || 0
      });

      // Create enhanced historical context
      const recentMessages = contextData.messages.slice(-10);
      let historicalContext = '';
      
      if (recentMessages.length > 0) {
        historicalContext = 'Previous conversation context:\n';
        recentMessages.forEach(msg => {
          historicalContext += `${msg.role}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}\n`;
        });
      }

      // Create attachment context
      const attachmentContext = [
        ...contextData.sessionAttachments?.map(att => `File: ${att.file_name}`) || [],
        ...contextData.sessionLinks?.map(link => `URL: ${link.url}`) || []
      ].slice(-5);

      const tokenEstimate = Math.ceil(historicalContext.length / 4);

      setConversationContext({
        sessionId: contextData.sessionId,
        currentMessages: [], // Will be populated by the parent component
        historicalContext,
        attachmentContext,
        tokenEstimate,
        messages: contextData.messages,
        totalMessages: contextData.totalMessages,
        sessionAttachments: contextData.sessionAttachments || [],
        sessionLinks: contextData.sessionLinks || []
      });

      // Show restoration notification if there's meaningful context
      if (contextData.totalMessages > 2) {
        toast({
          title: "Conversation Restored",
          description: `Loaded ${contextData.totalMessages} messages with full context for enhanced analysis.`,
        });
      }
    }
  }, [contextData, sessionId, toast]);

  // Auto-save trigger - save every 5 messages
  const triggerAutoSave = useCallback((messages: ChatMessage[]) => {
    const messageCount = messages.length;
    setAutoSaveState(prev => ({ ...prev, messageCount }));

    if (messageCount > 0 && messageCount % 5 === 0) {
      console.log('🔄 ENHANCED CHAT CONTEXT - Triggering auto-save at message:', messageCount);
      autoSaveMutation.mutate(messages);
    }
  }, [autoSaveMutation]);

  // Load historical context method
  const loadHistoricalContext = useCallback((sessionId: string) => {
    console.log('📚 ENHANCED CHAT CONTEXT - Loading historical context for session:', sessionId);
    refetchContext();
  }, [refetchContext]);

  // Create contextual prompt with full conversation history
  const createContextualPrompt = useCallback((
    currentMessage: string,
    template?: any
  ) => {
    let contextualPrompt = '';

    // Add historical context if available
    if (conversationContext.historicalContext) {
      contextualPrompt += `CONVERSATION HISTORY:\n${conversationContext.historicalContext}\n\n`;
    }

    // Add attachment context if available  
    if (conversationContext.attachmentContext.length > 0) {
      contextualPrompt += `REFERENCED MATERIALS:\n${conversationContext.attachmentContext.join('\n')}\n\n`;
    }

    // Add template if provided
    if (template && template.content) {
      contextualPrompt += `ANALYSIS FRAMEWORK:\n${template.content}\n\n`;
    }

    // Add current message
    contextualPrompt += `CURRENT REQUEST:\n${currentMessage}`;

    // Add enhanced context instruction
    if (conversationContext.historicalContext || conversationContext.attachmentContext.length > 0) {
      contextualPrompt += `\n\nIMPORTANT: Use the conversation history and referenced materials above to provide contextual, personalized analysis that builds on our previous discussions. Reference specific points from our conversation when relevant.`;
    }

    console.log('🎯 ENHANCED CHAT CONTEXT - Created contextual prompt:', {
      originalLength: currentMessage.length,
      contextualLength: contextualPrompt.length,
      hasHistory: !!conversationContext.historicalContext,
      hasAttachments: conversationContext.attachmentContext.length > 0,
      tokenEstimate: conversationContext.tokenEstimate
    });

    return contextualPrompt;
  }, [conversationContext]);

  // Check if we should create a conversation summary
  const shouldCreateSummary = useCallback((messages: ChatMessage[]) => {
    // Create summary every 20 messages or if token estimate is high
    return messages.length > 0 && 
           (messages.length % 20 === 0 || conversationContext.tokenEstimate > 8000);
  }, [conversationContext.tokenEstimate]);

  // Create conversation summary
  const createConversationSummary = useCallback(async (
    sessionId: string,
    messages: ChatMessage[]
  ) => {
    try {
      console.log('📝 ENHANCED CHAT CONTEXT - Creating conversation summary...');
      
      // Create a summary of recent conversation
      const recentMessages = messages.slice(-15);
      const summaryContent = recentMessages.map(msg => 
        `${msg.role}: ${msg.content.substring(0, 300)}${msg.content.length > 300 ? '...' : ''}`
      ).join('\n');

      const summary = `Recent conversation summary (${recentMessages.length} messages):\n${summaryContent}`;
      
      await ChatSessionService.createSummary(
        sessionId,
        summary,
        recentMessages.length,
        Math.ceil(summary.length / 4)
      );

      console.log('✅ ENHANCED CHAT CONTEXT - Summary created successfully');
      
      toast({
        title: "Conversation Summarized", 
        description: "Long conversation archived to maintain optimal performance.",
      });
      
    } catch (error) {
      console.error('❌ ENHANCED CHAT CONTEXT - Error creating summary:', error);
    }
  }, [toast]);

  // Manual save function
  const saveConversation = useCallback(async (messages: ChatMessage[]) => {
    if (!sessionId) return;
    
    try {
      setAutoSaveState(prev => ({ ...prev, status: 'saving' }));
      await ChatSessionService.saveConversationContext(sessionId, messages);
      
      setAutoSaveState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: new Date()
      }));
      
      toast({
        title: "Conversation Saved",
        description: "Your analysis session has been saved successfully.",
      });
      
    } catch (error) {
      setAutoSaveState(prev => ({ ...prev, status: 'error' }));
      throw error;
    }
  }, [sessionId, toast]);

  // Update session context when sessionId changes
  useEffect(() => {
    if (sessionId) {
      setConversationContext(prev => ({
        ...prev,
        sessionId
      }));
      
      // Reset auto-save state for new session
      setAutoSaveState({
        status: 'idle',
        messageCount: 0
      });
      
      console.log('🔄 ENHANCED CHAT CONTEXT - Session changed to:', sessionId);
    }
  }, [sessionId]);

  return {
    conversationContext,
    autoSaveState,
    isLoadingContext,
    triggerAutoSave,
    loadHistoricalContext,
    createContextualPrompt,
    saveConversation,
    shouldCreateSummary,
    createConversationSummary
  };
};
