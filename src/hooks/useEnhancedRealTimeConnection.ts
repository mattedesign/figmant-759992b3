
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConnectionMetrics {
  connectionAttempts: number;
  successfulConnections: number;
  failedConnections: number;
  averageReconnectTime: number;
  lastConnectionTime: Date | null;
  uptime: number;
}

interface RealtimeEvent {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  timestamp: Date;
  payload: any;
}

export const useEnhancedRealTimeConnection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'fallback' | 'disabled'>('connecting');
  const [isEnabled, setIsEnabled] = useState(true);
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    connectionAttempts: 0,
    successfulConnections: 0,
    failedConnections: 0,
    averageReconnectTime: 0,
    lastConnectionTime: null,
    uptime: 0
  });
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'unknown'>('unknown');

  const channelRef = useRef<any>(null);
  const connectionStartTimeRef = useRef<number>(0);
  const uptimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUpRef = useRef(false);

  const MAX_RETRIES = 5;
  const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff
  const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  const MAX_RECENT_EVENTS = 50;

  // Connection quality assessment
  const assessConnectionQuality = useCallback(() => {
    const { successfulConnections, failedConnections, averageReconnectTime } = metrics;
    const successRate = successfulConnections / (successfulConnections + failedConnections) || 0;
    
    if (successRate > 0.95 && averageReconnectTime < 2000) {
      setConnectionQuality('excellent');
    } else if (successRate > 0.8 && averageReconnectTime < 5000) {
      setConnectionQuality('good');
    } else if (successRate > 0.5) {
      setConnectionQuality('poor');
    } else {
      setConnectionQuality('unknown');
    }
  }, [metrics]);

  // Update metrics
  const updateMetrics = useCallback((update: Partial<ConnectionMetrics>) => {
    setMetrics(prev => {
      const updated = { ...prev, ...update };
      return updated;
    });
  }, []);

  // Add event to recent events
  const addRecentEvent = useCallback((event: RealtimeEvent) => {
    setRecentEvents(prev => [event, ...prev.slice(0, MAX_RECENT_EVENTS - 1)]);
  }, []);

  // Health check
  const performHealthCheck = useCallback(() => {
    if (channelRef.current && connectionStatus === 'connected') {
      try {
        // Send a ping to check connection health
        const pingStart = performance.now();
        channelRef.current.send({
          type: 'broadcast',
          event: 'ping',
          payload: { timestamp: Date.now() }
        });
        
        // If we don't get a response within 5 seconds, consider connection unhealthy
        setTimeout(() => {
          const pingDuration = performance.now() - pingStart;
          if (pingDuration > 5000) {
            console.warn('Real-time connection health check failed');
            setConnectionStatus('error');
          }
        }, 5000);
      } catch (error) {
        console.error('Health check failed:', error);
        setConnectionStatus('error');
      }
    }
  }, [connectionStatus]);

  // Clean up connection
  const cleanupConnection = useCallback(() => {
    console.log('Cleaning up enhanced real-time connection...');
    isCleaningUpRef.current = true;

    if (uptimeIntervalRef.current) {
      clearInterval(uptimeIntervalRef.current);
      uptimeIntervalRef.current = null;
    }

    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
      healthCheckIntervalRef.current = null;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log('Enhanced real-time channel removed successfully');
      } catch (err) {
        console.error('Error removing enhanced real-time channel:', err);
      }
      channelRef.current = null;
    }
  }, []);

  // Setup connection
  const setupConnection = useCallback(() => {
    if (!isEnabled || isCleaningUpRef.current) {
      return;
    }

    const connectionStartTime = performance.now();
    connectionStartTimeRef.current = connectionStartTime;
    
    setConnectionStatus('connecting');
    updateMetrics({ connectionAttempts: metrics.connectionAttempts + 1 });

    const channelName = `enhanced-analysis-updates-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Setting up enhanced real-time connection:', channelName);

    try {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      channelRef.current = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: '' }
          }
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'design_analysis'
          },
          (payload) => {
            console.log('Enhanced real-time: Design analysis change:', payload);
            
            const event: RealtimeEvent = {
              id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: payload.eventType as any,
              table: 'design_analysis',
              timestamp: new Date(),
              payload: payload.new || payload.old
            };
            
            addRecentEvent(event);
            
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
              
              if (payload.eventType === 'INSERT') {
                toast({
                  title: "New Analysis Available",
                  description: "A new analysis has been completed and is now visible.",
                });
              } else if (payload.eventType === 'UPDATE') {
                toast({
                  title: "Analysis Updated",
                  description: "An analysis has been updated with new information.",
                });
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'design_uploads'
          },
          (payload) => {
            console.log('Enhanced real-time: Upload change:', payload);
            
            const event: RealtimeEvent = {
              id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: payload.eventType as any,
              table: 'design_uploads',
              timestamp: new Date(),
              payload: payload.new || payload.old
            };
            
            addRecentEvent(event);
            
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'design_batch_analysis'
          },
          (payload) => {
            console.log('Enhanced real-time: Batch analysis change:', payload);
            
            const event: RealtimeEvent = {
              id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: payload.eventType as any,
              table: 'design_batch_analysis',
              timestamp: new Date(),
              payload: payload.new || payload.old
            };
            
            addRecentEvent(event);
            
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
              
              if (payload.eventType === 'INSERT') {
                toast({
                  title: "New Batch Analysis Available",
                  description: "A new batch analysis has been completed and is now visible.",
                });
              }
            }
          }
        )
        .on('broadcast', { event: 'ping' }, (payload) => {
          // Respond to health check pings
          console.log('Received ping, connection is healthy');
        })
        .subscribe((status, err) => {
          console.log('Enhanced real-time subscription status:', status, err);
          
          if (isCleaningUpRef.current) {
            return;
          }
          
          const connectionDuration = performance.now() - connectionStartTime;
          
          switch (status) {
            case 'SUBSCRIBED':
              setConnectionStatus('connected');
              const now = new Date();
              updateMetrics({
                successfulConnections: metrics.successfulConnections + 1,
                lastConnectionTime: now,
                averageReconnectTime: (metrics.averageReconnectTime + connectionDuration) / 2
              });
              
              // Start uptime tracking
              uptimeIntervalRef.current = setInterval(() => {
                updateMetrics({ uptime: Date.now() - now.getTime() });
              }, 1000);
              
              // Start health checks
              healthCheckIntervalRef.current = setInterval(performHealthCheck, HEALTH_CHECK_INTERVAL);
              
              console.log('Enhanced real-time connection established successfully');
              break;
              
            case 'CHANNEL_ERROR':
            case 'TIMED_OUT':
            case 'CLOSED':
              setConnectionStatus('error');
              updateMetrics({ failedConnections: metrics.failedConnections + 1 });
              
              // Retry with exponential backoff
              const retryCount = metrics.connectionAttempts % MAX_RETRIES;
              const retryDelay = RETRY_DELAYS[retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
              
              if (retryCount < MAX_RETRIES) {
                console.log(`Retrying enhanced connection in ${retryDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                retryTimeoutRef.current = setTimeout(() => {
                  if (!isCleaningUpRef.current) {
                    setupConnection();
                  }
                }, retryDelay);
              } else {
                console.warn('Max retry attempts reached, switching to fallback mode');
                setConnectionStatus('fallback');
              }
              break;
          }
        });
        
    } catch (err) {
      console.error('Failed to set up enhanced real-time connection:', err);
      setConnectionStatus('error');
      updateMetrics({ failedConnections: metrics.failedConnections + 1 });
    }
  }, [isEnabled, metrics, queryClient, toast, addRecentEvent, updateMetrics, performHealthCheck]);

  // Toggle connection
  const toggleConnection = useCallback(() => {
    setIsEnabled(prev => {
      const newEnabled = !prev;
      if (newEnabled) {
        setupConnection();
      } else {
        setConnectionStatus('disabled');
        cleanupConnection();
      }
      return newEnabled;
    });
  }, [setupConnection, cleanupConnection]);

  // Retry connection
  const retryConnection = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setupConnection();
  }, [setupConnection]);

  // Clear recent events
  const clearRecentEvents = useCallback(() => {
    setRecentEvents([]);
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      connectionAttempts: 0,
      successfulConnections: 0,
      failedConnections: 0,
      averageReconnectTime: 0,
      lastConnectionTime: null,
      uptime: 0
    });
  }, []);

  // Assess connection quality when metrics change
  useEffect(() => {
    assessConnectionQuality();
  }, [metrics, assessConnectionQuality]);

  // Setup connection on mount
  useEffect(() => {
    if (isEnabled) {
      setupConnection();
    }

    return cleanupConnection;
  }, [isEnabled, setupConnection, cleanupConnection]);

  return {
    connectionStatus,
    isEnabled,
    metrics,
    recentEvents,
    connectionQuality,
    toggleConnection,
    retryConnection,
    clearRecentEvents,
    resetMetrics,
    setupConnection,
    cleanupConnection
  };
};
