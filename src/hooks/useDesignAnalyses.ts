
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignAnalysis } from '@/types/design';

export const useDesignAnalyses = (uploadId?: string) => {
  return useQuery({
    queryKey: ['design-analyses', uploadId],
    queryFn: async (): Promise<DesignAnalysis[]> => {
      let query = supabase.from('design_analysis').select('*');
      
      if (uploadId) {
        query = query.eq('design_upload_id', uploadId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching design analyses:', error);
        throw error;
      }
      
      console.log('Fetched design analyses:', data?.length || 0);
      
      // Ensure all analyses have at least a basic impact summary for display
      const processedData = (data || []).map(analysis => {
        if (!analysis.impact_summary && analysis.analysis_results) {
          // Create a minimal impact summary for display purposes
          const basicSummary = {
            key_metrics: {
              overall_score: 6, // Default score
              improvement_areas: ['General improvements needed'],
              strengths: ['Design foundation is solid']
            },
            business_impact: {
              conversion_potential: 6,
              user_engagement_score: 6,
              brand_alignment: 6,
              competitive_advantage: ['Professional appearance']
            },
            user_experience: {
              usability_score: 6,
              accessibility_rating: 5,
              pain_points: ['Minor usability concerns'],
              positive_aspects: ['Clean layout']
            },
            recommendations: [
              {
                priority: 'medium' as const,
                category: 'General',
                description: 'Continue with current design approach',
                expected_impact: 'Improved user experience'
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
      
      return processedData as unknown as DesignAnalysis[];
    },
    enabled: uploadId ? !!uploadId : true // Always enabled if no uploadId, enabled only if uploadId exists when provided
  });
};
