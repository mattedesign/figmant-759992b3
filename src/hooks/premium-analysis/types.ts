
import { StepData } from '@/components/figmant/pages/premium-analysis/types';

export interface PremiumAnalysisRequest {
  stepData: StepData;
  selectedPrompt: any;
}

export interface PremiumAnalysisResult {
  analysis: string;
  savedAnalysisId: string;
  debugInfo?: any;
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
  uploaded_file_paths: string[]; // Add this missing property
  is_premium: boolean;
  premium_type: string;
  credits_used: number;
}
