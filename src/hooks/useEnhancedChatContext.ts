
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { ChatSessionService } from '@/services/chatSessionService';
import { useToast } from '@/hooks/use-toast';

interface ConversationContext {
  currentMessages: ChatMessage[];
  historicalContext: string;
  attachmentContext: string[];
  tokenEstimate: number;
  lastSummaryAt?: Date;
}

export const useEnhancedChatContext = (sessionId?: string) => {
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    currentMessages: [],
    historicalContext: '',
    attachmentContext: [],
    tokenEstimate: 0
  });
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const { toast } = useToast();

  // Load historical context from database
  const loadHistoricalContext = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    setIsLoadingContext(true);
    try {
      console.log('🔄 ENHANCED CHAT CONTEXT - Loading historical context for session:', sessionId);
      
      // Load messages from database
      const messages = await ChatSessionService.loadMessages(sessionId);
      console.log('📚 ENHANCED CHAT CONTEXT - Loaded messages:', messages.length);

      // Load conversation summaries
      const summaries = await ChatSessionService.getSummaries(sessionId);
      console.log('📝 ENHANCED CHAT CONTEXT - Loaded summaries:', summaries.length);

      // Convert database messages to ChatMessage format
      const chatMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        attachments: msg.attachments?.map(att => ({
          id: att.id || crypto.randomUUID(),
          type: att.type === 'url' ? 'url' : 'file',
          name: att.name || 'Unknown',
          url: att.url,
          uploadPath: att.path,
          status: 'uploaded' as const
        }))
      }));

      // Create historical context from summaries and recent messages
      let historicalContext = '';
      if (summaries.length > 0) {
        const latestSummary = summaries[0];
        historicalContext = `Previous conversation summary: ${latestSummary.summary_content}\n\n`;
      }

      // Add recent messages context (last 10 messages)
      const recentMessages = chatMessages.slice(-10);
      if (recentMessages.length > 0) {
        historicalContext += 'Recent conversation:\n';
        recentMessages.forEach(msg => {
          historicalContext += `${msg.role}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}\n`;
        });
      }

      // Estimate token count (rough approximation: 1 token ≈ 4 characters)
      const tokenEstimate = Math.ceil(historicalContext.length / 4);

      // Extract attachment context
      const attachmentContext = chatMessages
        .filter(msg => msg.attachments && msg.attachments.length > 0)
        .map(msg => `User uploaded: ${msg.attachments?.map(att => att.name).join(', ')}`)
        .slice(-5); // Last 5 attachment contexts

      setConversationContext({
        currentMessages: chatMessages,
        historicalContext,
        attachmentContext,
        tokenEstimate,
        lastSummaryAt: summaries.length > 0 ? new Date(summaries[0].created_at) : undefined
      });

      console.log('✅ ENHANCED CHAT CONTEXT - Context loaded:', {
        messagesCount: chatMessages.length,
        summariesCount: summaries.length,
        tokenEstimate,
        hasAttachments: attachmentContext.length > 0
      });

    } catch (error) {
      console.error('❌ ENHANCED CHAT CONTEXT - Error loading context:', error);
      toast({
        variant: "destructive",
        title: "Context Loading Failed",
        description: "Could not load conversation history. Starting fresh.",
      });
    } finally {
      setIsLoadingContext(false);
    }
  }, [toast]);

  // Save message with context
  const saveMessageWithContext = useCallback(async (
    sessionId: string,
    message: ChatMessage,
    messageOrder: number
  ) => {
    try {
      console.log('💾 ENHANCED CHAT CONTEXT - Saving message with context:', message.role);
      
      // Extract attachment IDs if present
      const attachmentIds: string[] = [];
      const linkIds: string[] = [];
      
      if (message.attachments) {
        message.attachments.forEach(att => {
          if (att.type === 'file' && att.uploadPath) {
            attachmentIds.push(att.id);
          } else if (att.type === 'url' && att.url) {
            linkIds.push(att.id);
          }
        });
      }

      await ChatSessionService.saveMessage(
        sessionId,
        message.role,
        message.content,
        messageOrder,
        { timestamp: message.timestamp.toISOString() },
        attachmentIds,
        linkIds
      );

      console.log('✅ ENHANCED CHAT CONTEXT - Message saved successfully');
      
    } catch (error) {
      console.error('❌ ENHANCED CHAT CONTEXT - Error saving message:', error);
      throw error;
    }
  }, []);

  // Create contextual prompt with conversation history
  const createContextualPrompt = useCallback((
    currentMessage: string,
    template?: any
  ) => {
    let contextualPrompt = '';

    // Add historical context if available
    if (conversationContext.historicalContext) {
      contextualPrompt += `CONVERSATION CONTEXT:\n${conversationContext.historicalContext}\n\n`;
    }

    // Add attachment context if available
    if (conversationContext.attachmentContext.length > 0) {
      contextualPrompt += `ATTACHMENT CONTEXT:\n${conversationContext.attachmentContext.join('\n')}\n\n`;
    }

    // Add template if provided
    if (template && template.content) {
      contextualPrompt += `ANALYSIS TEMPLATE:\n${template.content}\n\n`;
    }

    // Add current message
    contextualPrompt += `CURRENT REQUEST:\n${currentMessage}`;

    // Add instruction for context usage
    if (conversationContext.historicalContext || conversationContext.attachmentContext.length > 0) {
      contextualPrompt += `\n\nIMPORTANT: Use the conversation context above to provide more relevant and personalized analysis. Reference previous discussions and uploaded files when appropriate.`;
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
      
      // Create a summary of the conversation
      const recentMessages = messages.slice(-15); // Last 15 messages
      const summaryContent = recentMessages.map(msg => 
        `${msg.role}: ${msg.content.substring(0, 300)}${msg.content.length > 300 ? '...' : ''}`
      ).join('\n');

      const summary = `Summary of recent conversation:\n${summaryContent}`;
      
      await ChatSessionService.createSummary(
        sessionId,
        summary,
        recentMessages.length,
        Math.ceil(summary.length / 4) // Token estimate
      );

      console.log('✅ ENHANCED CHAT CONTEXT - Summary created successfully');
      
    } catch (error) {
      console.error('❌ ENHANCED CHAT CONTEXT - Error creating summary:', error);
    }
  }, []);

  return {
    conversationContext,
    isLoadingContext,
    loadHistoricalContext,
    saveMessageWithContext,
    createContextualPrompt,
    shouldCreateSummary,
    createConversationSummary
  };
};
