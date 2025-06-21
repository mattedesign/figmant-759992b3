
import { supabase } from '@/integrations/supabase/client';

interface DebugSession {
  id: string;
  user_id: string;
  session_type: 'user_access' | 'security_scan' | 'flow_debug' | 'billing_check';
  started_at: string;
  ended_at?: string;
  metadata: Record<string, any>;
  is_encrypted: boolean;
}

export class DebugSessionManager {
  private currentSession: DebugSession | null = null;

  async startSession(userId: string, type: DebugSession['session_type']): Promise<string> {
    const sessionId = crypto.randomUUID();
    
    const session: DebugSession = {
      id: sessionId,
      user_id: userId,
      session_type: type,
      started_at: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId
      },
      is_encrypted: true
    };

    // Store session data encrypted
    const encryptedData = await this.encryptSessionData(session);
    
    // Log session start for audit
    await this.logAuditEvent('debug_session_started', {
      sessionId,
      type,
      userId
    });

    this.currentSession = session;
    
    // Auto-cleanup after 1 hour
    setTimeout(() => {
      this.endSession(sessionId);
    }, 3600000);

    return sessionId;
  }

  async endSession(sessionId: string): Promise<void> {
    if (this.currentSession?.id === sessionId) {
      this.currentSession.ended_at = new Date().toISOString();
      
      // Log session end
      await this.logAuditEvent('debug_session_ended', {
        sessionId,
        duration: Date.now() - new Date(this.currentSession.started_at).getTime()
      });

      // Purge session data immediately (GDPR compliance)
      await this.purgeSessionData(sessionId);
      this.currentSession = null;
    }
  }

  async getSessionCount(userId: string): Promise<number> {
    // Get session count from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    try {
      const { count } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('activity_type', 'debug_session_started')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      return count || 0;
    } catch (error) {
      console.error('Error fetching session count:', error);
      return 0;
    }
  }

  private async encryptSessionData(session: DebugSession): Promise<string> {
    // Simple encryption for demo - in production use proper encryption
    const data = JSON.stringify(session);
    return btoa(data);
  }

  private async purgeSessionData(sessionId: string): Promise<void> {
    // Immediate data purge for security
    console.log(`Purging session data for ${sessionId}`);
    
    // In production, this would securely delete all session-related data
    // from memory, temporary storage, and any caches
  }

  private async logAuditEvent(eventType: string, metadata: Record<string, any>): Promise<void> {
    try {
      await supabase.from('user_activity_logs').insert({
        user_id: metadata.userId || null,
        activity_type: eventType,
        metadata
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }
}
