
export type CategoryType = 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing' | 'premium' | 'general';

export interface PromptTemplate {
  id: string;
  title: string;
  display_name: string;
  description?: string;
  category: CategoryType;
  original_prompt: string;
  claude_response: string;
  effectiveness_rating?: number;
  use_case_context?: string;
  business_domain?: string;
  is_template: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
