
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatSessionService, SavedChatMessage } from '@/services/chatSessionService';

interface ConversationContext {
  currentMessages: ChatMessage[];
  historicalContext: string;
  attachmentContext: string;
  tokenEstimate: number;
}

export const useEnhancedChatContext = (sessionId?: string) => {
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    currentMessages: [],
    historicalContext: '',
    attachmentContext: '',
    tokenEstimate: 0
  });
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // Load historical context when session changes
  useEffect(() => {
    if (sessionId) {
      loadHistoricalContext(sessionId);
    }
  }, [sessionId]);

  const loadHistoricalContext = useCallback(async (sessionId: string) => {
    try {
      setIsLoadingContext(true);
      console.log('📚 ENHANCED CONTEXT - Loading historical context for session:', sessionId);

      // Load saved messages
      const savedMessages = await ChatSessionService.loadMessages(sessionId);
      console.log('📚 ENHANCED CONTEXT - Loaded', savedMessages.length, 'saved messages');

      // Load conversation summaries
      const summaries = await ChatSessionService.getSummaries(sessionId);
      console.log('📚 ENHANCED CONTEXT - Loaded', summaries.length, 'conversation summaries');

      // Convert saved messages to current format
      const historicalMessages: ChatMessage[] = savedMessages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        attachments: msg.attachments?.map(att => ({
          id: att.id,
          type: att.type,
          name: att.name,
          url: att.url,
          uploadPath: att.path,
          status: 'uploaded' as const
        })) || []
      }));

      // Build historical context string
      let historicalContext = '';
      
      // Add conversation summaries if available
      if (summaries.length > 0) {
        historicalContext += '## Previous Conversation Summary:\n';
        summaries.forEach(summary => {
          historicalContext += `${summary.summary_content}\n\n`;
        });
      }

      // Add recent message context (last 10 messages for context)
      if (historicalMessages.length > 0) {
        const recentMessages = historicalMessages.slice(-10);
        historicalContext += '## Recent Conversation Context:\n';
        recentMessages.forEach(msg => {
          historicalContext += `${msg.role}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}\n`;
        });
      }

      // Build attachment context
      let attachmentContext = '';
      const allAttachments = historicalMessages
        .flatMap(msg => msg.attachments || [])
        .filter(Boolean);

      if (allAttachments.length > 0) {
        attachmentContext = '## Available Context Files:\n';
        allAttachments.forEach(att => {
          attachmentContext += `- ${att.name} (${att.type})\n`;
        });
      }

      // Estimate token count (rough approximation: 4 chars = 1 token)
      const tokenEstimate = Math.ceil((historicalContext.length + attachmentContext.length) / 4);

      setConversationContext({
        currentMessages: historicalMessages,
        historicalContext,
        attachmentContext,
        tokenEstimate
      });

      console.log('📚 ENHANCED CONTEXT - Context built:', {
        messagesCount: historicalMessages.length,
        attachmentsCount: allAttachments.length,
        tokenEstimate,
        contextLength: historicalContext.length
      });

    } catch (error) {
      console.error('📚 ENHANCED CONTEXT - Error loading context:', error);
    } finally {
      setIsLoadingContext(false);
    }
  }, []);

  const saveMessageWithContext = useCallback(async (
    sessionId: string,
    message: ChatMessage,
    messageOrder: number
  ) => {
    try {
      console.log('💾 ENHANCED CONTEXT - Saving message:', message.id);

      // Extract attachment and link IDs
      const attachmentIds: string[] = [];
      const linkIds: string[] = [];

      if (message.attachments) {
        message.attachments.forEach(att => {
          if (att.type === 'file') {
            attachmentIds.push(att.id);
          } else if (att.type === 'url') {
            linkIds.push(att.id);
          }
        });
      }

      // Save the message
      const savedMessageId = await ChatSessionService.saveMessage(
        sessionId,
        message.role,
        message.content,
        messageOrder,
        {
          timestamp: message.timestamp?.toISOString(),
          uploadIds: message.uploadIds,
          batchId: message.batchId
        },
        attachmentIds,
        linkIds
      );

      console.log('💾 ENHANCED CONTEXT - Message saved with ID:', savedMessageId);
      return savedMessageId;

    } catch (error) {
      console.error('💾 ENHANCED CONTEXT - Error saving message:', error);
      throw error;
    }
  }, []);

  const createContextualPrompt = useCallback((userMessage: string, template?: any) => {
    let enhancedPrompt = '';

    // Add conversation context if available
    if (conversationContext.historicalContext) {
      enhancedPrompt += conversationContext.historicalContext + '\n\n';
    }

    // Add attachment context if available
    if (conversationContext.attachmentContext) {
      enhancedPrompt += conversationContext.attachmentContext + '\n\n';
    }

    // Add template context if provided
    if (template) {
      enhancedPrompt += `## Analysis Template: ${template.title}\n`;
      enhancedPrompt += `${template.original_prompt}\n\n`;
    }

    // Add current user message
    enhancedPrompt += `## Current Request:\n${userMessage}`;

    console.log('🎯 ENHANCED CONTEXT - Created contextual prompt:', {
      totalLength: enhancedPrompt.length,
      hasHistoricalContext: !!conversationContext.historicalContext,
      hasAttachmentContext: !!conversationContext.attachmentContext,
      hasTemplate: !!template,
      tokenEstimate: conversationContext.tokenEstimate
    });

    return enhancedPrompt;
  }, [conversationContext]);

  const shouldCreateSummary = useCallback((messages: ChatMessage[]) => {
    // Create summary if we have more than 20 messages
    // or if the conversation is getting long (estimated > 4000 tokens)
    return messages.length > 20 || conversationContext.tokenEstimate > 4000;
  }, [conversationContext.tokenEstimate]);

  const createConversationSummary = useCallback(async (
    sessionId: string,
    messages: ChatMessage[]
  ) => {
    try {
      console.log('📝 ENHANCED CONTEXT - Creating conversation summary for', messages.length, 'messages');

      // Create a summary of the conversation
      const messagesToSummarize = messages.slice(0, -5); // Keep last 5 messages unsummarized
      let summaryContent = 'Conversation Summary:\n\n';

      messagesToSummarize.forEach((msg, index) => {
        if (index < 10) { // Limit to key points
          summaryContent += `${msg.role}: ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}\n`;
        }
      });

      summaryContent += '\nKey Discussion Points:\n';
      summaryContent += '- User requests and AI responses have been summarized above\n';
      summaryContent += '- Full context maintained for analysis continuity\n';

      const tokenEstimate = Math.ceil(summaryContent.length / 4);

      const summaryId = await ChatSessionService.createSummary(
        sessionId,
        summaryContent,
        messagesToSummarize.length,
        tokenEstimate
      );

      console.log('📝 ENHANCED CONTEXT - Summary created with ID:', summaryId);
      return summaryId;

    } catch (error) {
      console.error('📝 ENHANCED CONTEXT - Error creating summary:', error);
      throw error;
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
