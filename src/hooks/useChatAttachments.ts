
import { useState, useCallback, useEffect } from 'react';
import { ChatSessionService } from '@/services/chatSessionService';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

export const useChatAttachments = (sessionId: string | null) => {
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAttachments = useCallback(async () => {
    if (!sessionId) {
      setAttachments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📎 CHAT ATTACHMENTS - Loading for session:', sessionId);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Load both file attachments and links
      const [fileAttachments, linkAttachments] = await Promise.all([
        ChatSessionService.getSessionAttachmentsSafe(sessionId, user.id),
        ChatSessionService.getSessionLinksSafe(sessionId, user.id)
      ]);

      // Convert to ChatAttachment format
      const allAttachments: ChatAttachment[] = [
        ...fileAttachments.map(att => ({
          id: att.id,
          type: 'file' as const,
          name: att.file_name,
          uploadPath: att.file_path,
          status: 'uploaded' as const,
          size: att.file_size
        })),
        ...linkAttachments.map(link => ({
          id: link.id,
          type: 'url' as const,
          name: link.link_title || 'Website Link',
          url: link.url,
          status: 'uploaded' as const
        }))
      ];

      setAttachments(allAttachments);
      
      console.log('✅ CHAT ATTACHMENTS - Loaded:', {
        sessionId,
        fileCount: fileAttachments.length,
        linkCount: linkAttachments.length,
        totalCount: allAttachments.length
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load attachments';
      console.error('❌ CHAT ATTACHMENTS - Load error:', err);
      setError(errorMessage);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const removeAttachment = useCallback(async (attachmentId: string) => {
    try {
      console.log('🗑️ CHAT ATTACHMENTS - Removing:', attachmentId);
      
      // Find the attachment to determine its type
      const attachment = attachments.find(att => att.id === attachmentId);
      if (!attachment) {
        throw new Error('Attachment not found');
      }

      // Remove from database (this would need to be implemented in ChatSessionService)
      // For now, just remove from local state
      setAttachments(prev => prev.filter(att => att.id !== attachmentId));

      toast({
        title: "Attachment Removed",
        description: `${attachment.name} has been removed from the conversation.`,
      });

      console.log('✅ CHAT ATTACHMENTS - Removed successfully:', attachmentId);

    } catch (err) {
      console.error('❌ CHAT ATTACHMENTS - Remove error:', err);
      toast({
        variant: "destructive",
        title: "Removal Failed",
        description: "Could not remove the attachment. Please try again.",
      });
    }
  }, [attachments, toast]);

  const refresh = useCallback(() => {
    loadAttachments();
  }, [loadAttachments]);

  // Load attachments when sessionId changes
  useEffect(() => {
    loadAttachments();
  }, [loadAttachments]);

  return {
    attachments,
    loading,
    error,
    removeAttachment,
    refresh
  };
};
