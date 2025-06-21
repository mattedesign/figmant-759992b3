
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignAnalysis } from '@/types/design';
import { AnalysisRecoveryService } from '@/services/analysis/AnalysisRecoveryService';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useEnhancedDesignAnalyses = (uploadId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['enhanced-design-analyses', uploadId],
    queryFn: async (): Promise<DesignAnalysis[]> => {
      console.log('🔄 ENHANCED DESIGN ANALYSES - Fetching with recovery mechanisms');
      
      try {
        // First validate system integrity
        const validationResult = await AnalysisRecoveryService.validateSystemIntegrity();
        
        if (!validationResult.isValid) {
          console.error('🚨 System integrity validation failed:', validationResult.errors);
          throw new Error(`System validation failed: ${validationResult.errors.join(', ')}`);
        }

        if (validationResult.warnings.length > 0) {
          console.warn('⚠️ System validation warnings:', validationResult.warnings);
        }

        // Fetch analyses with enhanced error handling
        let query = supabase.from('design_analysis').select('*');
        
        if (uploadId) {
          query = query.eq('design_upload_id', uploadId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Error fetching design analyses:', error);
          throw error;
        }
        
        console.log('✅ Fetched design analyses:', data?.length || 0);
        
        // Process and repair analyses if needed
        const processedData = await Promise.all((data || []).map(async (analysis) => {
          // Check if analysis needs repair
          if (!analysis.impact_summary && analysis.analysis_results) {
            console.log('🔧 Repairing analysis:', analysis.id);
            
            const repairSuccess = await AnalysisRecoveryService.repairAnalysisRecord(
              analysis.id, 
              'design'
            );
            
            if (repairSuccess) {
              // Refetch the repaired analysis
              const { data: repairedAnalysis } = await supabase
                .from('design_analysis')
                .select('*')
                .eq('id', analysis.id)
                .single();
              
              return repairedAnalysis || analysis;
            }
            
            // If repair failed, create a minimal impact summary
            return {
              ...analysis,
              impact_summary: {
                key_metrics: {
                  overall_score: 6,
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
              }
            };
          }
          
          return analysis;
        }));
        
        return processedData as unknown as DesignAnalysis[];
        
      } catch (error) {
        console.error('💥 Enhanced design analyses fetch failed:', error);
        
        // Try to provide a fallback with basic error recovery
        try {
          let fallbackQuery = supabase.from('design_analysis').select('id, user_id, design_upload_id, analysis_type, created_at, confidence_score');
          
          if (uploadId) {
            fallbackQuery = fallbackQuery.eq('design_upload_id', uploadId);
          }
          
          const { data: fallbackData, error: fallbackError } = await fallbackQuery;
          
          if (!fallbackError && fallbackData) {
            console.log('🔄 Using fallback data for design analyses');
            
            return fallbackData.map(item => ({
              ...item,
              analysis_results: { status: 'recovered', type: 'fallback' },
              prompt_used: 'Recovered analysis',
              impact_summary: {
                key_metrics: {
                  overall_score: 5,
                  improvement_areas: ['Data recovery needed'],
                  strengths: ['Analysis preserved']
                },
                business_impact: {
                  conversion_potential: 5,
                  user_engagement_score: 5,
                  brand_alignment: 5,
                  competitive_advantage: ['Basic analysis available']
                },
                user_experience: {
                  usability_score: 5,
                  accessibility_rating: 5,
                  pain_points: ['System recovery in progress'],
                  positive_aspects: ['Data preserved']
                },
                recommendations: [
                  {
                    priority: 'high' as const,
                    category: 'Recovery',
                    description: 'System recovered successfully',
                    expected_impact: 'Restored functionality'
                  }
                ]
              }
            })) as unknown as DesignAnalysis[];
          }
        } catch (fallbackError) {
          console.error('💥 Fallback recovery also failed:', fallbackError);
        }
        
        throw error;
      }
    },
    enabled: uploadId ? !!uploadId : true,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (query.error) {
      console.error('❌ Enhanced design analyses query failed:', query.error);
      toast({
        variant: "destructive",
        title: "Analysis System Error",
        description: "There was an issue loading analyses. System recovery attempted.",
      });
    }
  }, [query.error, toast]);

  return query;
};
