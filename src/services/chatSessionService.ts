
import { supabase } from '@/integrations/supabase/client';

export interface SavedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  message_order: number;
  metadata: any;
  attachments: any[];
}

export interface ConversationSummary {
  id: string;
  summary_content: string;
  messages_included: number;
  token_count_estimate: number;
  created_at: string;
}

export class ChatSessionService {
  // Create a new chat session
  static async createSession(sessionName?: string) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        session_name: sessionName || `Chat ${new Date().toLocaleDateString()}`,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create chat session');
    }

    return data;
  }

  // Save a message with its attachments
  static async saveMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    messageOrder: number,
    metadata: any = {},
    attachmentIds: string[] = [],
    linkIds: string[] = []
  ) {
    const { data, error } = await supabase.rpc('save_chat_message', {
      p_session_id: sessionId,
      p_role: role,
      p_content: content,
      p_message_order: messageOrder,
      p_metadata: metadata,
      p_attachment_ids: attachmentIds,
      p_link_ids: linkIds
    });

    if (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }

    return data;
  }

  // Load messages for a session
  static async loadMessages(sessionId: string): Promise<SavedChatMessage[]> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_session_messages_safe', {
      p_session_id: sessionId,
      p_user_id: user.id
    });

    if (error) {
      console.error('Error loading messages:', error);
      throw new Error('Failed to load messages');
    }

    return data || [];
  }

  // Save file attachment
  static async saveAttachment(
    sessionId: string,
    messageId: string,
    fileName: string,
    filePath: string,
    fileSize?: number,
    fileType?: string
  ) {
    const { data, error } = await supabase
      .from('chat_attachments')
      .insert({
        chat_session_id: sessionId,
        message_id: messageId,
        file_name: fileName,
        file_path: filePath,
        file_size: fileSize,
        file_type: fileType,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving attachment:', error);
      throw new Error('Failed to save attachment');
    }

    return data;
  }

  // Save link attachment
  static async saveLink(
    sessionId: string,
    messageId: string,
    url: string,
    title?: string,
    description?: string,
    thumbnail?: string
  ) {
    const { data, error } = await supabase
      .from('chat_links')
      .insert({
        chat_session_id: sessionId,
        message_id: messageId,
        url,
        link_title: title,
        link_description: description,
        link_thumbnail: thumbnail,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving link:', error);
      throw new Error('Failed to save link');
    }

    return data;
  }

  // Create conversation summary
  static async createSummary(
    sessionId: string,
    summaryContent: string,
    messagesIncluded: number,
    tokenCountEstimate: number = 0
  ) {
    const { data, error } = await supabase.rpc('create_conversation_summary', {
      p_session_id: sessionId,
      p_summary_content: summaryContent,
      p_messages_included: messagesIncluded,
      p_token_count_estimate: tokenCountEstimate
    });

    if (error) {
      console.error('Error creating summary:', error);
      throw new Error('Failed to create conversation summary');
    }

    return data;
  }

  // Get conversation summaries for a session
  static async getSummaries(sessionId: string): Promise<ConversationSummary[]> {
    const { data, error } = await supabase
      .from('chat_conversation_summaries')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading summaries:', error);
      throw new Error('Failed to load conversation summaries');
    }

    return data || [];
  }
}
