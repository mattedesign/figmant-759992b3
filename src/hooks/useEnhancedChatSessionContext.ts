
import { useState, useCallback, useEffect } from 'react';
import { ChatSessionService } from '@/services/chatSessionService';
import { useToast } from '@/hooks/use-toast';

interface SessionContext {
  sessionId?: string;
  sessionName?: string;
  isInitialized: boolean;
  messageCount: number;
  lastActivity?: Date;
}

export const useEnhancedChatSessionContext = () => {
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    isInitialized: false,
    messageCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize or create session
  const initializeSession = useCallback(async (sessionName?: string) => {
    setIsLoading(true);
    try {
      console.log('🔄 SESSION CONTEXT - Initializing session...');
      
      const session = await ChatSessionService.createSession(sessionName);
      
      setSessionContext({
        sessionId: session.id,
        sessionName: session.session_name,
        isInitialized: true,
        messageCount: 0,
        lastActivity: new Date(session.created_at)
      });

      console.log('✅ SESSION CONTEXT - Session initialized:', session.id);
      return session;
      
    } catch (error) {
      console.error('❌ SESSION CONTEXT - Error initializing session:', error);
      toast({
        variant: "destructive",
        title: "Session Error",
        description: "Failed to initialize chat session",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load existing session
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      console.log('🔄 SESSION CONTEXT - Loading session:', sessionId);
      
      // Load session messages to get context
      const messages = await ChatSessionService.loadMessages(sessionId);
      
      setSessionContext({
        sessionId,
        isInitialized: true,
        messageCount: messages.length,
        lastActivity: messages.length > 0 ? new Date(messages[messages.length - 1].created_at) : undefined
      });

      console.log('✅ SESSION CONTEXT - Session loaded:', {
        sessionId,
        messageCount: messages.length
      });
      
    } catch (error) {
      console.error('❌ SESSION CONTEXT - Error loading session:', error);
      toast({
        variant: "destructive",
        title: "Session Error",
        description: "Failed to load chat session",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update session activity
  const updateSessionActivity = useCallback(() => {
    if (sessionContext.sessionId) {
      setSessionContext(prev => ({
        ...prev,
        lastActivity: new Date(),
        messageCount: prev.messageCount + 1
      }));
    }
  }, [sessionContext.sessionId]);

  return {
    sessionContext,
    isLoading,
    initializeSession,
    loadSession,
    updateSessionActivity
  };
};
