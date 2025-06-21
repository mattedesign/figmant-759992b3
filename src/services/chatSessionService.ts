
import { supabase } from '@/integrations/supabase/client';

export interface ChatSession {
  id: string;
  user_id: string;
  session_name?: string;
  created_at: string;
  last_activity: string;
  is_active: boolean;
}

export interface ChatAttachmentRecord {
  id: string;
  chat_session_id: string;
  message_id?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  upload_timestamp: string;
  is_active: boolean;
  created_by: string;
}

export interface ChatLinkRecord {
  id: string;
  chat_session_id: string;
  message_id?: string;
  url: string;
  link_title?: string;
  link_description?: string;
  link_thumbnail?: string;
  upload_timestamp: string;
  is_active: boolean;
  created_by: string;
}

export class ChatSessionService {
  static async createSession(sessionName?: string): Promise<ChatSession | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          session_name: sessionName || `Chat ${new Date().toLocaleString()}`,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createSession:', error);
      return null;
    }
  }

  static async getSessionsByUser(): Promise<ChatSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Use the safe function to prevent infinite loops
      const { data, error } = await supabase.rpc('get_user_sessions_safe', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching chat sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSessionsByUser:', error);
      return [];
    }
  }

  static async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_session_activity', {
        session_id: sessionId
      });

      if (error) {
        console.error('Error updating session activity:', error);
      }
    } catch (error) {
      console.error('Error in updateSessionActivity:', error);
    }
  }

  static async saveAttachment(
    sessionId: string,
    messageId: string,
    fileName: string,
    filePath: string,
    fileSize?: number,
    fileType?: string
  ): Promise<ChatAttachmentRecord | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('chat_attachments')
        .insert({
          chat_session_id: sessionId,
          message_id: messageId,
          file_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          file_type: fileType,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving attachment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in saveAttachment:', error);
      return null;
    }
  }

  static async saveLink(
    sessionId: string,
    messageId: string,
    url: string,
    title?: string,
    description?: string,
    thumbnail?: string
  ): Promise<ChatLinkRecord | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('chat_links')
        .insert({
          chat_session_id: sessionId,
          message_id: messageId,
          url,
          link_title: title,
          link_description: description,
          link_thumbnail: thumbnail,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving link:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in saveLink:', error);
      return null;
    }
  }

  static async getSessionAttachments(sessionId: string): Promise<ChatAttachmentRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Use the safe function to prevent infinite loops
      const { data, error } = await supabase.rpc('get_session_attachments_safe', {
        p_session_id: sessionId,
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching session attachments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSessionAttachments:', error);
      return [];
    }
  }

  static async getSessionLinks(sessionId: string): Promise<ChatLinkRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Use the safe function to prevent infinite loops
      const { data, error } = await supabase.rpc('get_session_links_safe', {
        p_session_id: sessionId,
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching session links:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSessionLinks:', error);
      return [];
    }
  }

  static async uploadFileToStorage(file: File, sessionId: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${sessionId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      return data.path;
    } catch (error) {
      console.error('Error in file upload:', error);
      return null;
    }
  }

  static async getFileUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  }
}
