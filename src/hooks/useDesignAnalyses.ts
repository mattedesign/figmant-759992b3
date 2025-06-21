
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignAnalysis, ImpactSummary } from '@/types/design';

// Transform the database response to match our TypeScript interface
const transformDesignAnalysis = (dbAnalysis: any): DesignAnalysis => {
  return {
    id: dbAnalysis.id,
    user_id: dbAnalysis.user_id,
    design_upload_id: dbAnalysis.design_upload_id,
    analysis_type: dbAnalysis.analysis_type,
    prompt_used: dbAnalysis.prompt_used,
    analysis_results: typeof dbAnalysis.analysis_results === 'string' 
      ? JSON.parse(dbAnalysis.analysis_results) 
      : dbAnalysis.analysis_results || {},
    confidence_score: dbAnalysis.confidence_score,
    suggestions: typeof dbAnalysis.suggestions === 'string' 
      ? JSON.parse(dbAnalysis.suggestions) 
      : dbAnalysis.suggestions,
    impact_summary: transformImpactSummary(dbAnalysis.impact_summary),
    improvement_areas: dbAnalysis.improvement_areas || [],
    created_at: dbAnalysis.created_at,
  };
};

// Transform impact summary to match the full ImpactSummary interface
const transformImpactSummary = (impactSummary: any): ImpactSummary | undefined => {
  if (!impactSummary) return undefined;
  
  const parsed = typeof impactSummary === 'string' ? JSON.parse(impactSummary) : impactSummary;
  
  return {
    business_impact: {
      conversion_potential: parsed.business_impact?.conversion_potential || 0,
      user_engagement_score: parsed.business_impact?.user_engagement_score || 0,
      brand_alignment: parsed.business_impact?.brand_alignment || 0,
      competitive_advantage: parsed.business_impact?.competitive_advantage || [],
    },
    user_experience: {
      usability_score: parsed.user_experience?.usability_score || 0,
      accessibility_rating: parsed.user_experience?.accessibility_rating || 0,
      pain_points: parsed.user_experience?.pain_points || [],
      positive_aspects: parsed.user_experience?.positive_aspects || [],
    },
    recommendations: parsed.recommendations || [],
    key_metrics: {
      overall_score: parsed.key_metrics?.overall_score || 0,
      improvement_areas: parsed.key_metrics?.improvement_areas || [],
      strengths: parsed.key_metrics?.strengths || [],
    },
  };
};

export const useDesignAnalyses = () => {
  return useQuery({
    queryKey: ['design-analyses'],
    queryFn: async (): Promise<DesignAnalysis[]> => {
      const { data, error } = await supabase
        .from('design_analysis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching design analyses:', error);
        throw error;
      }
      
      console.log('Fetched design analyses:', data?.length || 0);
      return (data || []).map(transformDesignAnalysis);
    }
  });
};
