
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

  const initializeSession = useCallback(async (sessionName?: string) => {
    if (sessionContext.isInitialized && sessionContext.sessionId) {
      console.log('🔧 SESSION CONTEXT - Session already initialized:', sessionContext.sessionId);
      return sessionContext.sessionId;
    }

    setIsLoading(true);
    try {
      console.log('🔧 SESSION CONTEXT - Creating new session...');
      
      const session = await ChatSessionService.createSession(
        sessionName || `Enhanced Chat ${new Date().toLocaleDateString()}`
      );

      const newContext: SessionContext = {
        sessionId: session.id,
        sessionName: session.session_name,
        isInitialized: true,
        messageCount: 0,
        lastActivity: new Date(session.created_at)
      };

      setSessionContext(newContext);

      console.log('✅ SESSION CONTEXT - Session initialized:', newContext);
      
      toast({
        title: "Enhanced Session Ready",
        description: "Your conversation context is now active with full history tracking.",
      });

      return session.id;
    } catch (error) {
      console.error('❌ SESSION CONTEXT - Initialization failed:', error);
      toast({
        variant: "destructive",
        title: "Session Creation Failed",
        description: "Could not initialize enhanced chat context. Some features may be limited.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionContext.isInitialized, sessionContext.sessionId, toast]);

  const updateMessageCount = useCallback((count: number) => {
    setSessionContext(prev => ({
      ...prev,
      messageCount: count,
      lastActivity: new Date()
    }));
  }, []);

  return {
    sessionContext,
    isLoading,
    initializeSession,
    updateMessageCount
  };
};
