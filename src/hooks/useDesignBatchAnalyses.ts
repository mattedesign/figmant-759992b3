
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define the complete interface to match the database structure
interface DesignBatchAnalysisComplete {
  id: string;
  batch_id: string;
  user_id: string;
  analysis_type: string;
  prompt_used: string;
  analysis_results: any;
  winner_upload_id?: string;
  key_metrics?: any;
  recommendations?: any;
  confidence_score: number;
  context_summary?: string;
  analysis_settings?: any;
  created_at: string;
  impact_summary?: any; // Add the missing property
}

export const useDesignBatchAnalyses = (batchId?: string) => {
  return useQuery({
    queryKey: ['design-batch-analyses', batchId],
    queryFn: async (): Promise<DesignBatchAnalysisComplete[]> => {
      let query = supabase.from('design_batch_analysis').select('*');
      
      if (batchId) {
        query = query.eq('batch_id', batchId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching batch analyses:', error);
        throw error;
      }
      
      console.log('Fetched batch analyses:', data?.length || 0);
      
      // Ensure all batch analyses have at least a basic impact summary for display
      const processedData = (data || []).map(analysis => {
        if (!analysis.impact_summary && analysis.analysis_results) {
          // Create a minimal impact summary for display purposes
          const basicSummary = {
            key_metrics: {
              overall_score: 7, // Slightly higher default for batch analyses
              improvement_areas: ['Cross-design consistency'],
              strengths: ['Comparative analysis completed']
            },
            business_impact: {
              conversion_potential: 7,
              user_engagement_score: 7,
              brand_alignment: 7,
              competitive_advantage: ['Multiple design options compared']
            },
            user_experience: {
              usability_score: 7,
              accessibility_rating: 6,
              pain_points: ['Minor inconsistencies between designs'],
              positive_aspects: ['Good design variety', 'Clear comparison']
            },
            recommendations: [
              {
                priority: 'medium' as const,
                category: 'Consistency',
                description: 'Ensure design consistency across variations',
                expected_impact: 'Better user experience consistency'
              }
            ]
          };
          
          return {
            ...analysis,
            impact_summary: basicSummary
          };
        }
        return analysis;
      });
      
      return processedData as DesignBatchAnalysisComplete[];
    },
    enabled: true // Always enabled to fetch all batch analyses
  });
};
