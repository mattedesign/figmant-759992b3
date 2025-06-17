
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

export const CATEGORY_OPTIONS = [
  { value: 'master', label: 'Master Analysis' },
  { value: 'competitor', label: 'Competitor Analysis' },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy' },
  { value: 'copy_messaging', label: 'Copy & Messaging' },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue' },
  { value: 'ab_testing', label: 'A/B Testing' },
  { value: 'premium', label: 'Premium Analysis' },
  { value: 'general', label: 'General Analysis' }
] as const;

export interface PromptUpdaterProps {
  templateId: string;
  icon: any;
  accentColor: string;
}

export interface PromptUpdateStatus {
  status: 'idle' | 'updating' | 'success' | 'error';
}
