
import { StepData } from '@/components/figmant/pages/premium-analysis/types';
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';

export interface PremiumAnalysisRequest {
  stepData: StepData;
  selectedPrompt: any;
}

export interface PremiumAnalysisResult {
  analysis: string;
  savedAnalysisId: string;
  debugInfo?: any;
  structuredAnalysis?: ContextualAnalysisResult;
  confidenceScore?: number;
}

export interface AnalysisResults {
  response: string;
  premium_analysis_data: any;
  selected_prompt_id: string;
  selected_prompt_category: string;
  project_name: string;
  analysis_goals: string;
  desired_outcome: string;
  files_uploaded: number;
  reference_links: number;
  uploaded_file_paths: string[];
  is_premium: boolean;
  premium_type: string;
  credits_used: number;
}
