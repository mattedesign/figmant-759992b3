
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DesignAnalysis {
  id: string;
  user_id: string;
  design_upload_id: string;
  analysis_type: string;
  prompt_used: string;
  analysis_results: {
    title?: string;
    project_name?: string;
    response?: string;
    summary?: string;
    analysis?: string;
    recommendations?: any;
  };
  confidence_score: number;
  suggestions?: any;
  impact_summary?: {
    key_metrics?: Record<string, any>;
    business_impact?: string;
  };
  improvement_areas?: string[];
  created_at: string;
}

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
      return data || [];
    }
  });
};
