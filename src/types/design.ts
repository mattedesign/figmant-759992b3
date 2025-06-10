
export interface DesignUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  use_case: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
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

export interface DesignUseCase {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
  analysis_focus: string[];
  created_at: string;
  updated_at: string;
}
