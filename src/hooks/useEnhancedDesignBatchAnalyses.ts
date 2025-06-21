
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignBatchAnalysis } from '@/types/design';
import { AnalysisRecoveryService } from '@/services/analysis/AnalysisRecoveryService';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useEnhancedDesignBatchAnalyses = (batchId?: string) => {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['enhanced-batch-analyses', batchId],
    queryFn: async (): Promise<DesignBatchAnalysis[]> => {
      console.log('🔄 ENHANCED BATCH ANALYSES - Fetching with recovery mechanisms');
      
      try {
        // First validate system integrity
        const validationResult = await AnalysisRecoveryService.validateSystemIntegrity();
        
        if (!validationResult.isValid) {
          console.error('🚨 Batch system integrity validation failed:', validationResult.errors);
          // Continue with limited functionality rather than failing completely
        }

        let query = supabase.from('design_batch_analysis').select('*');
        
        if (batchId) {
          query = query.eq('batch_id', batchId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Error fetching batch analyses:', error);
          throw error;
        }
        
        console.log('✅ Fetched batch analyses:', data?.length || 0);
        
        // Process analyses without repair attempts for removed columns
        const processedData = (data || []).map(analysis => {
          // Create basic structure without deprecated fields
          return {
            ...analysis,
            // Ensure basic required fields exist
            analysis_results: analysis.analysis_results || { status: 'recovered', type: 'batch_fallback' },
            prompt_used: analysis.prompt_used || 'Recovered batch analysis',
            analysis_type: analysis.analysis_type || 'batch_comparative'
          };
        });
        
        return processedData as unknown as DesignBatchAnalysis[];
        
      } catch (error) {
        console.error('💥 Enhanced batch analyses fetch failed:', error);
        
        // Provide fallback with error recovery
        try {
          let fallbackQuery = supabase.from('design_batch_analysis').select('id, user_id, batch_id, analysis_type, created_at, confidence_score');
          
          if (batchId) {
            fallbackQuery = fallbackQuery.eq('batch_id', batchId);
          }
          
          const { data: fallbackData, error: fallbackError } = await fallbackQuery;
          
          if (!fallbackError && fallbackData) {
            console.log('🔄 Using fallback data for batch analyses');
            
            return fallbackData.map(item => ({
              ...item,
              analysis_results: { status: 'recovered', type: 'batch_fallback' },
              prompt_used: 'Recovered batch analysis',
              analysis_type: item.analysis_type || 'batch_comparative'
            })) as unknown as DesignBatchAnalysis[];
          }
        } catch (fallbackError) {
          console.error('💥 Batch fallback recovery failed:', fallbackError);
        }
        
        throw error;
      }
    },
    enabled: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 20000)
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (query.error) {
      console.error('❌ Enhanced batch analyses query failed:', query.error);
      toast({
        variant: "destructive",
        title: "Batch Analysis System Error",
        description: "There was an issue loading batch analyses. Recovery attempted.",
      });
    }
  }, [query.error, toast]);

  return query;
};
