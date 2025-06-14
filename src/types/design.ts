
export interface DesignUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  use_case: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  source_type: 'file' | 'url';
  source_url: string | null;
  batch_id: string | null;
  batch_name: string | null;
  analysis_goals: string | null;
  analysis_preferences: AnalysisPreferences | null;
  original_batch_id: string | null;
  is_replacement: boolean | null;
  replaced_upload_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisPreferences {
  auto_comparative: boolean;
  context_integration: boolean;
  analysis_depth?: 'basic' | 'detailed' | 'comprehensive';
  focus_areas?: string[];
  [key: string]: any; // Add index signature to make it compatible with Json type
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

export interface DesignContextFile {
  id: string;
  upload_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  content_preview: string | null;
  created_at: string;
}

export interface ImpactSummary {
  business_impact: {
    conversion_potential: number;
    user_engagement_score: number;
    brand_alignment: number;
    competitive_advantage: string[];
  };
  user_experience: {
    usability_score: number;
    accessibility_rating: number;
    pain_points: string[];
    positive_aspects: string[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    expected_impact: string;
  }[];
  key_metrics: {
    overall_score: number;
    improvement_areas: string[];
    strengths: string[];
  };
}

export interface DesignAnalysis {
  id: string;
  design_upload_id: string;
  user_id: string;
  analysis_type: string;
  prompt_used: string;
  analysis_results: any;
  confidence_score: number;
  suggestions?: any;
  improvement_areas?: string[];
  impact_summary?: ImpactSummary;
  created_at: string;
}

export interface DesignBatchAnalysis {
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
  parent_analysis_id?: string;
  modification_summary?: string;
  version_number?: number;
  impact_summary?: ImpactSummary;
  created_at: string;
}

export interface DesignUseCase {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
  analysis_focus: string[];
  created_at: string;
  updated_at: string;
}

export interface BatchUpload {
  batchId?: string;
  batchName: string;
  files: File[];
  urls: string[];
  contextFiles?: File[];
  useCase: string;
  analysisGoals?: string;
  analysisPreferences?: AnalysisPreferences;
}
