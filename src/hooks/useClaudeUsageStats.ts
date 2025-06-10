
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClaudeUsageStats } from '@/types/claude';

export const useClaudeUsageStats = (enabled: boolean) => {
  return useQuery({
    queryKey: ['claude-usage-stats'],
    queryFn: async (): Promise<ClaudeUsageStats> => {
      const { data, error } = await supabase
        .from('claude_usage_logs')
        .select('tokens_used, cost_usd, created_at, success')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const totalTokens = data.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const totalCost = data.reduce((sum, log) => sum + (log.cost_usd || 0), 0);
      const requestCount = data.length;
      const successfulRequests = data.filter(log => log.success).length;
      const errorRate = requestCount > 0 ? ((requestCount - successfulRequests) / requestCount * 100).toFixed(1) : '0';
      
      return { totalTokens, totalCost, requestCount, successfulRequests, errorRate };
    },
    enabled
  });
};
