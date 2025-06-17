
export interface FigmantPromptTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing';
  prompt_template: string;
  analysis_focus: string[];
  requires_context?: boolean;
  best_for?: string[];
  example_use_cases?: string[];
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
}

export interface EnhancedAnalysisConfig {
  template: FigmantPromptTemplate;
  variables: FigmantPromptVariables;
  customInstructions?: string;
  focusAreas?: string[];
  outputFormat?: 'detailed' | 'executive_summary' | 'actionable_checklist';
}
