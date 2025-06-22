
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';

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

export interface ConversationContext {
  sessionId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
    attachments?: number;
  }>;
  totalMessages: number;
  sessionAttachments: any[];
  sessionLinks: any[];
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

    // Type cast all problematic fields to ensure TypeScript compatibility
    return (data || []).map(msg => ({
      ...msg,
      role: msg.role as 'user' | 'assistant',           // Cast role to union type
      attachments: Array.isArray(msg.attachments) ? msg.attachments : (msg.attachments as any) || [],  // Cast Json to any[]
      metadata: (msg.metadata as any) || {}              // Cast Json to any (object, not array)
    }));
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

  // Method to save conversation context to analysis history
  static async saveConversationContext(
    sessionId: string,
    messages: ChatMessage[],
    analysisType: string = 'conversation_context'
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from('chat_analysis_history')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        prompt_used: `Conversation in session: ${sessionId}`,
        analysis_results: {
          session_id: sessionId,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            attachments_count: msg.attachments?.length || 0
          })),
          message_count: messages.length,
          last_updated: new Date().toISOString()
        },
        analysis_type: analysisType,
        confidence_score: 1.0
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving conversation context:', error);
      return null;
    }

    return data.id;
  }

  // Method to load conversation context
  static async loadConversationContext(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_analysis_history')
      .select('*')
      .eq('analysis_type', 'conversation_context')
      .contains('analysis_results', { session_id: sessionId })
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      console.log('No conversation context found for session:', sessionId);
      return [];
    }

    const context = data[0].analysis_results as any;
    
    // Convert stored conversation back to ChatMessage format
    return context.conversation_history.map((msg: any, index: number) => ({
      id: `restored-${index}-${Date.now()}`,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      attachments: msg.attachments_count > 0 ? [] : undefined // Will be loaded separately
    }));
  }

  // Method to get conversation summary for Claude context
  static async getConversationSummary(sessionId: string): Promise<ConversationContext | null> {
    try {
      // Load conversation history
      const messages = await this.loadConversationContext(sessionId);
      
      // Load attachments and links
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const [attachmentsData, linksData] = await Promise.all([
        supabase.rpc('get_session_attachments_safe', {
          p_session_id: sessionId,
          p_user_id: user.id
        }),
        supabase.rpc('get_session_links_safe', {
          p_session_id: sessionId,
          p_user_id: user.id
        })
      ]);

      return {
        sessionId,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
          attachments: msg.attachments?.length
        })),
        totalMessages: messages.length,
        sessionAttachments: attachmentsData.data || [],
        sessionLinks: linksData.data || []
      };
    } catch (error) {
      console.error('Error getting conversation summary:', error);
      return null;
    }
  }
}
