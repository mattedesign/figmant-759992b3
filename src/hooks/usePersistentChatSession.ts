
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatSessionService, ChatSession, ChatAttachmentRecord, ChatLinkRecord } from '@/services/chatSessionService';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePersistentChatSession = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for user's chat sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['chat-sessions', user?.id],
    queryFn: ChatSessionService.getSessionsByUser,
    enabled: !!user
  });

  // Query for current session's attachments
  const { data: sessionAttachments = [] } = useQuery({
    queryKey: ['session-attachments', currentSessionId],
    queryFn: () => currentSessionId ? ChatSessionService.getSessionAttachments(currentSessionId) : [],
    enabled: !!currentSessionId
  });

  // Query for current session's links
  const { data: sessionLinks = [] } = useQuery({
    queryKey: ['session-links', currentSessionId],
    queryFn: () => currentSessionId ? ChatSessionService.getSessionLinks(currentSessionId) : [],
    enabled: !!currentSessionId
  });

  // Mutation for creating a new session
  const createSessionMutation = useMutation({
    mutationFn: (sessionName?: string) => ChatSessionService.createSession(sessionName),
    onSuccess: (session) => {
      if (session) {
        setCurrentSessionId(session.id);
        setIsSessionInitialized(true);
        queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
        
        toast({
          title: "New Chat Session",
          description: `Started new chat: ${session.session_name}`,
        });
      }
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
      toast({
        variant: "destructive",
        title: "Session Creation Failed",
        description: "Unable to create new chat session. Please try again.",
      });
    }
  });

  // Mutation for saving attachments
  const saveAttachmentMutation = useMutation({
    mutationFn: async ({ 
      file, 
      messageId 
    }: { 
      file: File; 
      messageId: string; 
    }) => {
      if (!currentSessionId) throw new Error('No active session');
      
      // Upload file to storage
      const filePath = await ChatSessionService.uploadFileToStorage(file, currentSessionId);
      if (!filePath) throw new Error('File upload failed');

      // Save attachment record
      return ChatSessionService.saveAttachment(
        currentSessionId,
        messageId,
        file.name,
        filePath,
        file.size,
        file.type
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-attachments', currentSessionId] });
    },
    onError: (error) => {
      console.error('Failed to save attachment:', error);
      toast({
        variant: "destructive",
        title: "Attachment Save Failed",
        description: "Unable to save file attachment. Please try again.",
      });
    }
  });

  // Mutation for saving links
  const saveLinkMutation = useMutation({
    mutationFn: ({ 
      url, 
      messageId,
      title,
      description,
      thumbnail 
    }: { 
      url: string; 
      messageId: string;
      title?: string;
      description?: string;
      thumbnail?: string;
    }) => {
      if (!currentSessionId) throw new Error('No active session');
      
      return ChatSessionService.saveLink(
        currentSessionId,
        messageId,
        url,
        title,
        description,
        thumbnail
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-links', currentSessionId] });
    },
    onError: (error) => {
      console.error('Failed to save link:', error);
      toast({
        variant: "destructive",
        title: "Link Save Failed",
        description: "Unable to save link. Please try again.",
      });
    }
  });

  // Initialize or create session on component mount
  useEffect(() => {
    if (user && !isSessionInitialized && !sessionsLoading) {
      // Check if there's a recent active session
      const recentSession = sessions.find(s => s.is_active);
      
      if (recentSession) {
        setCurrentSessionId(recentSession.id);
        setIsSessionInitialized(true);
        
        // Update activity for this session
        ChatSessionService.updateSessionActivity(recentSession.id);
      } else {
        // Create a new session
        createSessionMutation.mutate();
      }
    }
  }, [user, sessions, sessionsLoading, isSessionInitialized]);

  const createNewSession = useCallback((sessionName?: string) => {
    createSessionMutation.mutate(sessionName);
  }, [createSessionMutation]);

  const switchToSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    ChatSessionService.updateSessionActivity(sessionId);
    
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      toast({
        title: "Switched Chat Session",
        description: `Now viewing: ${session.session_name}`,
      });
    }
  }, [sessions, toast]);

  const saveAttachmentFromMessage = useCallback(async (
    attachment: ChatAttachment,
    messageId: string
  ) => {
    if (!attachment.file || !currentSessionId) return;
    
    try {
      await saveAttachmentMutation.mutateAsync({
        file: attachment.file,
        messageId
      });
    } catch (error) {
      console.error('Error saving attachment:', error);
    }
  }, [currentSessionId, saveAttachmentMutation]);

  const saveLinkFromMessage = useCallback(async (
    attachment: ChatAttachment,
    messageId: string
  ) => {
    if (!attachment.url || !currentSessionId) return;
    
    try {
      await saveLinkMutation.mutateAsync({
        url: attachment.url,
        messageId,
        title: attachment.name
      });
    } catch (error) {
      console.error('Error saving link:', error);
    }
  }, [currentSessionId, saveLinkMutation]);

  const saveMessageAttachments = useCallback(async (
    message: ChatMessage
  ) => {
    if (!message.attachments || message.attachments.length === 0) return;

    // Save each attachment
    for (const attachment of message.attachments) {
      if (attachment.type === 'file' && attachment.file) {
        await saveAttachmentFromMessage(attachment, message.id);
      } else if (attachment.type === 'url' && attachment.url) {
        await saveLinkFromMessage(attachment, message.id);
      }
    }

    // Update session activity
    if (currentSessionId) {
      ChatSessionService.updateSessionActivity(currentSessionId);
    }
  }, [currentSessionId, saveAttachmentFromMessage, saveLinkFromMessage]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return {
    // Session management
    currentSessionId,
    currentSession,
    sessions,
    sessionsLoading,
    isSessionInitialized,
    
    // Session operations
    createNewSession,
    switchToSession,
    
    // Attachment operations
    saveMessageAttachments,
    sessionAttachments,
    sessionLinks,
    
    // Loading states
    isCreatingSession: createSessionMutation.isPending,
    isSavingAttachment: saveAttachmentMutation.isPending,
    isSavingLink: saveLinkMutation.isPending
  };
};
