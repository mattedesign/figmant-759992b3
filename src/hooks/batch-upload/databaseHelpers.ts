
import { supabase } from '@/integrations/supabase/client';
import { AnalysisPreferences } from '@/types/design';

export const insertDesignUpload = async (
  userId: string,
  fileName: string,
  filePath: string | null,
  fileSize: number | null,
  fileType: string | null,
  useCase: string,
  sourceType: 'file' | 'url',
  sourceUrl: string | null,
  batchId: string,
  batchName: string | null,
  analysisGoals: string | null,
  analysisPreferences: AnalysisPreferences | null
) => {
  const { data, error } = await supabase
    .from('design_uploads')
    .insert({
      user_id: userId,
      file_name: fileName,
      file_path: filePath,
      file_size: fileSize,
      file_type: fileType,
      use_case: useCase,
      status: 'pending',
      source_type: sourceType,
      source_url: sourceUrl,
      batch_id: batchId,
      batch_name: batchName,
      analysis_goals: analysisGoals,
      analysis_preferences: analysisPreferences ? JSON.parse(JSON.stringify(analysisPreferences)) : null
    })
    .select()
    .single();

  if (error) {
    console.error('Database insert error:', error);
    throw new Error(`Database error for ${fileName}: ${error.message}`);
  }

  return data;
};

export const insertContextFile = async (
  userId: string,
  uploadId: string,
  fileName: string,
  filePath: string,
  fileType: string,
  fileSize: number,
  contentPreview: string | null
) => {
  const { data, error } = await supabase
    .from('design_context_files')
    .insert({
      upload_id: uploadId,
      user_id: userId,
      file_name: fileName,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      content_preview: contentPreview
    })
    .select()
    .single();

  if (error) {
    console.error('Context file database error:', error);
    console.warn(`Context file ${fileName} could not be saved to database`);
  }

  return data;
};

export const fetchUseCase = async (useCaseId: string) => {
  const { data, error } = await supabase
    .from('design_use_cases')
    .select('*')
    .eq('id', useCaseId)
    .single();

  if (error) {
    console.error('Error fetching use case:', error);
    return null;
  }

  return data;
};
