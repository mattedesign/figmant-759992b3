
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RealTimeUpdate {
  id: string;
  type: 'analysis_status' | 'new_analysis' | 'system_status' | 'notification';
  data: any;
  timestamp: Date;
}

export const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const addUpdate = useCallback((update: Omit<RealTimeUpdate, 'timestamp'>) => {
    const newUpdate: RealTimeUpdate = {
      ...update,
      timestamp: new Date()
    };
    
    setUpdates(prev => [newUpdate, ...prev.slice(0, 49)]); // Keep last 50 updates
    
    // Trigger relevant query invalidations
    switch (update.type) {
      case 'analysis_status':
      case 'new_analysis':
        queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
        break;
    }
  }, [queryClient]);

  // Simulate real-time updates for demo purposes
  useEffect(() => {
    setIsConnected(true);
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      // Randomly generate different types of updates
      const updateTypes = [
        {
          type: 'analysis_status' as const,
          data: {
            analysisId: `analysis_${Date.now()}`,
            status: 'completed',
            confidence: Math.round(Math.random() * 30 + 70)
          }
        },
        {
          type: 'system_status' as const,
          data: {
            status: 'healthy',
            queueLength: Math.floor(Math.random() * 5)
          }
        }
      ];
      
      const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      if (Math.random() > 0.8) { // 20% chance of update
        addUpdate({
          id: `update_${Date.now()}`,
          ...randomUpdate
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [addUpdate]);

  // In a real implementation, you would set up Supabase real-time subscriptions here:
  // useEffect(() => {
  //   const channel = supabase
  //     .channel('analysis_updates')
  //     .on('postgres_changes', 
  //       { 
  //         event: '*', 
  //         schema: 'public', 
  //         table: 'design_analysis' 
  //       }, 
  //       (payload) => {
  //         addUpdate({
  //           id: `db_${payload.new?.id || Date.now()}`,
  //           type: 'analysis_status',
  //           data: payload.new
  //         });
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [addUpdate]);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  const getUpdatesByType = useCallback((type: RealTimeUpdate['type']) => {
    return updates.filter(update => update.type === type);
  }, [updates]);

  return {
    updates,
    isConnected,
    addUpdate,
    clearUpdates,
    getUpdatesByType
  };
};
