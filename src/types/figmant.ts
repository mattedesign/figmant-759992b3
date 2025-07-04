
export interface FigmantPromptTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing' | 'accessibility' | 'cross_device' | 'seasonal' | 'design_system';
  prompt_template: string;
  analysis_focus: string[];
  requires_context?: boolean;
  best_for?: string[];
  example_use_cases?: string[];
  contextual_fields?: ContextualField[];
}

export interface ContextualField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'url' | 'email';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FigmantPromptVariables {
  designType?: string;
  industry?: string;
  targetAudience?: string;
  businessGoals?: string;
  competitorUrls?: string[];
  brandGuidelines?: string;
  currentMetrics?: string;
  testHypothesis?: string;
  conversionGoals?: string;
  [key: string]: any; // Allow dynamic fields
}

export interface EnhancedAnalysisConfig {
  template: FigmantPromptTemplate;
  variables: FigmantPromptVariables;
  customInstructions?: string;
  focusAreas?: string[];
  outputFormat?: 'detailed' | 'executive_summary' | 'actionable_checklist';
}
