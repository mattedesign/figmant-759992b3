
import { CategoryType } from '@/types/promptTypes';

export interface EditedTemplateData {
  title: string;
  display_name: string;
  description: string;
  category: CategoryType;
  original_prompt: string;
  claude_response: string;
  effectiveness_rating: number;
  use_case_context: string;
  business_domain: string;
  is_template: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}
