
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatSessionService } from '@/services/chatSessionService';

interface ChatSession {
  id: string;
  session_name?: string;
  created_at: string;
  last_activity: string;
  is_active: boolean;
}

export const usePersistentChatSession = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionAttachments, setSessionAttachments] = useState<any[]>([]);
  const [sessionLinks, setSessionLinks] = useState<any[]>([]);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create new session
  const createNewSession = useCallback(async (sessionName?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const session = await ChatSessionService.createSession(sessionName);
      if (session) {
        setCurrentSessionId(session.id);
        setCurrentSession(session);
        setSessionAttachments([]);
        setSessionLinks([]);
        setIsSessionInitialized(true);
        
        // Refresh sessions list
        loadUserSessions();
      }
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create new session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user sessions safely with error handling
  const loadUserSessions = useCallback(async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Use the new safe function to prevent infinite loops
      const { data, error } = await supabase.rpc('get_user_sessions_safe', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error loading sessions:', error);
        setError('Failed to load sessions');
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error in loadUserSessions:', error);
      setError('Failed to load sessions');
    }
  }, []);

  // Switch to existing session
  const switchToSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        setCurrentSession(session);
        await loadSessionData(sessionId);
        setIsSessionInitialized(true);
      }
    } catch (error) {
      console.error('Error switching session:', error);
      setError('Failed to switch session');
    } finally {
      setIsLoading(false);
    }
  }, [sessions]);

  // Load session data safely
  const loadSessionData = useCallback(async (sessionId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Load attachments safely
      const { data: attachments, error: attachError } = await supabase.rpc('get_session_attachments_safe', {
        p_session_id: sessionId,
        p_user_id: user.id
      });

      if (attachError) {
        console.error('Error loading attachments:', attachError);
      } else {
        setSessionAttachments(attachments || []);
      }

      // Load links safely
      const { data: links, error: linksError } = await supabase.rpc('get_session_links_safe', {
        p_session_id: sessionId,
        p_user_id: user.id
      });

      if (linksError) {
        console.error('Error loading links:', linksError);
      } else {
        setSessionLinks(links || []);
      }
    } catch (error) {
      console.error('Error loading session data:', error);
      setError('Failed to load session data');
    }
  }, []);

  // Save message attachments
  const saveMessageAttachments = useCallback(async (message: ChatMessage) => {
    if (!currentSessionId || !message.attachments || message.attachments.length === 0) {
      return;
    }

    try {
      for (const attachment of message.attachments) {
        if (attachment.type === 'file' && attachment.uploadPath) {
          await ChatSessionService.saveAttachment(
            currentSessionId,
            message.id,
            attachment.name,
            attachment.uploadPath,
            attachment.file?.size,
            attachment.file?.type
          );
        } else if (attachment.type === 'url' && attachment.url) {
          await ChatSessionService.saveLink(
            currentSessionId,
            message.id,
            attachment.url,
            attachment.name
          );
        }
      }
      
      // Refresh session data
      await loadSessionData(currentSessionId);
    } catch (error) {
      console.error('Error saving message attachments:', error);
    }
  }, [currentSessionId, loadSessionData]);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;
    
    const initializeSession = async () => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user || !mounted) return;

        await loadUserSessions();
        
        if (!mounted) return;

        // Create a default session if none exist
        if (sessions.length === 0) {
          await createNewSession('Default Session');
        } else if (!currentSessionId) {
          // Use the most recent session
          const mostRecent = sessions[0];
          if (mostRecent) {
            setCurrentSessionId(mostRecent.id);
            setCurrentSession(mostRecent);
            await loadSessionData(mostRecent.id);
            setIsSessionInitialized(true);
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (mounted) {
          setError('Failed to initialize session');
        }
      }
    };

    initializeSession();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Load session data when switching sessions
  useEffect(() => {
    if (currentSessionId && currentSession) {
      loadSessionData(currentSessionId);
    }
  }, [currentSessionId, loadSessionData]);

  return {
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    isLoading,
    error,
    createNewSession,
    switchToSession,
    saveMessageAttachments,
    loadUserSessions
  };
};
