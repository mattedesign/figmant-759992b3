
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'file' | 'url';
  file_path?: string;
  url?: string;
  mime_type?: string;
  file_size?: number;
  chat_session_id: string;
  message_id?: string;
  created_at: string;
  created_by: string;
  status: 'uploading' | 'uploaded' | 'error';
  link_title?: string;
  link_description?: string;
  link_thumbnail?: string;
}

export const useChatAttachments = (sessionId: string | null) => {
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!sessionId || !user) {
      setAttachments([]);
      return;
    }
    loadAttachments();
  }, [sessionId, user]);

  const loadAttachments = async () => {
    if (!sessionId || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Load file attachments
      const { data: fileData, error: fileError } = await supabase
        .from('chat_attachments')
        .select('*')
        .eq('chat_session_id', sessionId)
        .eq('created_by', user.id)
        .eq('is_active', true)
        .order('upload_timestamp', { ascending: true });

      if (fileError) throw fileError;

      // Load link attachments  
      const { data: linkData, error: linkError } = await supabase
        .from('chat_links')
        .select('*')
        .eq('chat_session_id', sessionId)
        .eq('created_by', user.id)
        .eq('is_active', true)
        .order('upload_timestamp', { ascending: true });

      if (linkError) throw linkError;

      // Convert file attachments to unified format
      const fileAttachments: ChatAttachment[] = (fileData || []).map(file => ({
        id: file.id,
        name: file.file_name,
        type: 'file' as const,
        file_path: file.file_path,
        mime_type: file.file_type,
        file_size: file.file_size,
        chat_session_id: file.chat_session_id,
        message_id: file.message_id,
        created_at: file.upload_timestamp,
        created_by: file.created_by,
        status: 'uploaded' as const
      }));

      // Convert links to unified format
      const urlAttachments: ChatAttachment[] = (linkData || []).map(link => ({
        id: link.id,
        name: link.link_title || new URL(link.url).hostname,
        type: 'url' as const,
        url: link.url,
        chat_session_id: link.chat_session_id,
        message_id: link.message_id,
        created_at: link.upload_timestamp,
        created_by: link.created_by,
        status: 'uploaded' as const,
        link_title: link.link_title,
        link_description: link.link_description,
        link_thumbnail: link.link_thumbnail
      }));

      setAttachments([...fileAttachments, ...urlAttachments]);

    } catch (err) {
      console.error('Error loading attachments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  const addAttachment = async (attachment: Omit<ChatAttachment, 'id' | 'created_at' | 'created_by'>) => {
    if (!user || !sessionId) return;

    try {
      if (attachment.type === 'file') {
        const { data, error } = await supabase
          .from('chat_attachments')
          .insert({
            file_name: attachment.name,
            file_path: attachment.file_path!,
            file_type: attachment.mime_type,
            file_size: attachment.file_size,
            chat_session_id: sessionId,
            message_id: attachment.message_id,
            created_by: user.id
          })
          .select()
          .single();

        if (error) throw error;
        const newAttachment: ChatAttachment = {
          id: data.id,
          name: data.file_name,
          type: 'file',
          file_path: data.file_path,
          mime_type: data.file_type,
          file_size: data.file_size,
          chat_session_id: data.chat_session_id,
          message_id: data.message_id,
          created_at: data.upload_timestamp,
          created_by: data.created_by,
          status: 'uploaded'
        };
        setAttachments(prev => [...prev, newAttachment]);
        return newAttachment;

      } else if (attachment.type === 'url') {
        const { data, error } = await supabase
          .from('chat_links')
          .insert({
            url: attachment.url!,
            link_title: attachment.link_title,
            link_description: attachment.link_description,
            link_thumbnail: attachment.link_thumbnail,
            chat_session_id: sessionId,
            message_id: attachment.message_id,
            created_by: user.id
          })
          .select()
          .single();

        if (error) throw error;

        const newAttachment: ChatAttachment = {
          id: data.id,
          name: data.link_title || new URL(data.url).hostname,
          type: 'url',
          url: data.url,
          chat_session_id: data.chat_session_id,
          message_id: data.message_id,
          created_at: data.upload_timestamp,
          created_by: data.created_by,
          status: 'uploaded',
          link_title: data.link_title,
          link_description: data.link_description,
          link_thumbnail: data.link_thumbnail
        };

        setAttachments(prev => [...prev, newAttachment]);
        return newAttachment;
      }
    } catch (err) {
      console.error('Error adding attachment:', err);
      throw err;
    }
  };

  const removeAttachment = async (attachmentId: string) => {
    try {
      const attachment = attachments.find(a => a.id === attachmentId);
      if (!attachment) return;

      if (attachment.type === 'file') {
        const { error } = await supabase
          .from('chat_attachments')
          .update({ is_active: false })
          .eq('id', attachmentId)
          .eq('created_by', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('chat_links')
          .update({ is_active: false })
          .eq('id', attachmentId)
          .eq('created_by', user?.id);

        if (error) throw error;
      }

      setAttachments(prev => prev.filter(a => a.id !== attachmentId));

    } catch (err) {
      console.error('Error removing attachment:', err);
      throw err;
    }
  };

  return {
    attachments,
    loading,
    error,
    addAttachment,
    removeAttachment,
    refresh: loadAttachments
  };
};
