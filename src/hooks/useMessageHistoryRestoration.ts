
import { useState, useCallback } from 'react';
import { ChatMessage, SavedChatMessage, MessageHistoryState } from '@/types/chat';
import { ChatSessionService } from '@/services/chatSessionService';
import { useToast } from '@/hooks/use-toast';

export const useMessageHistoryRestoration = () => {
  const [historyState, setHistoryState] = useState<MessageHistoryState>({
    isLoading: false,
    messages: [],
    hasMore: false
  });
  const { toast } = useToast();

  const convertSavedToChat = useCallback((savedMessage: SavedChatMessage): ChatMessage => {
    return {
      id: savedMessage.id,
      role: savedMessage.role,
      content: savedMessage.content,
      timestamp: new Date(savedMessage.created_at),
      attachments: savedMessage.attachments?.map(att => ({
        id: att.id || crypto.randomUUID(),
        type: att.type === 'url' ? 'url' : 'file',
        name: att.name || 'Unknown',
        url: att.url,
        uploadPath: att.path,
        status: 'uploaded' as const
      }))
    };
  }, []);

  const loadMessageHistory = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    setHistoryState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      console.log('🔄 MESSAGE HISTORY - Loading messages for session:', sessionId);
      
      const savedMessages = await ChatSessionService.loadMessages(sessionId);
      console.log('📚 MESSAGE HISTORY - Loaded saved messages:', savedMessages.length);
      
      const chatMessages = savedMessages.map(convertSavedToChat);
      
      setHistoryState({
        isLoading: false,
        messages: chatMessages,
        hasMore: false,
        error: undefined
      });

      console.log('✅ MESSAGE HISTORY - Converted to chat messages:', chatMessages.length);
      return chatMessages;
      
    } catch (error) {
      console.error('❌ MESSAGE HISTORY - Error loading messages:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load message history';
      setHistoryState({
        isLoading: false,
        messages: [],
        hasMore: false,
        error: errorMessage
      });

      toast({
        variant: "destructive",
        title: "History Load Failed",
        description: "Could not load conversation history. Starting fresh.",
      });

      return [];
    }
  }, [convertSavedToChat, toast]);

  const clearHistory = useCallback(() => {
    setHistoryState({
      isLoading: false,
      messages: [],
      hasMore: false,
      error: undefined
    });
  }, []);

  return {
    historyState,
    loadMessageHistory,
    clearHistory
  };
};
