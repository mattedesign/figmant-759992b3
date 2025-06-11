
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
  created_at: string;
  updated_at: string;
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
  useCase: string;
  analysisGoals?: string;
}
